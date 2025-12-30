import type { ILoadOptionsFunctions, ResourceMapperFields } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { GlobalConfig } from '@n8n/config';
import { Container } from '@n8n/di';

import { convertJsonSchemaToResourceMapperFields } from './utils';
import type { McpAuthenticationOption, McpServerTransport } from '../shared/types';
import {
	getAuthHeaders,
	connectMcpClient,
	getAllTools,
	tryRefreshOAuth2Token,
	mapToNodeOperationError,
} from '../shared/utils';

export async function getToolParameters(
	this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
	const toolId = this.getNodeParameter('tool', 0, {
		extractValue: true,
	}) as string;
	const authentication = this.getNodeParameter('authentication') as McpAuthenticationOption;
	const mcpServer = this.getNodeParameter('mcpServer', { mode: 'url', value: '' }) as {
		mode: 'list' | 'url';
		value: string;
	};

	let serverTransport: McpServerTransport;
	let endpointUrl: string;

	if (mcpServer.mode === 'list') {
		const config = Container.get(GlobalConfig) as any;
		const server = config.mcp.servers.find((s: any) => s.name === mcpServer.value);
		if (!server) {
			throw new NodeOperationError(
				this.getNode(),
				`MCP Server "${mcpServer.value}" not found in configuration`,
			);
		}
		serverTransport = server.type as McpServerTransport;
		endpointUrl = server.url;
	} else {
		// Manual URL
		serverTransport = this.getNodeParameter('serverTransport') as McpServerTransport;
		endpointUrl = mcpServer.value;
	}

	if (!endpointUrl) {
		return { fields: [] };
	}

	const node = this.getNode();
	const { headers } = await getAuthHeaders(this, authentication);
	const client = await connectMcpClient({
		serverTransport,
		endpointUrl,
		headers,
		name: node.type,
		version: node.typeVersion,
		onUnauthorized: async (headers) => await tryRefreshOAuth2Token(this, authentication, headers),
	});

	if (!client.ok) {
		throw mapToNodeOperationError(node, client.error);
	}

	const result = await getAllTools(client.result);
	const tool = result.find((tool) => tool.name === toolId);
	if (!tool) {
		throw new NodeOperationError(this.getNode(), 'Tool not found');
	}

	const fields = convertJsonSchemaToResourceMapperFields(tool.inputSchema);
	return {
		fields,
	};
}
