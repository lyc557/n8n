import { GlobalConfig } from '@n8n/config';
import { Container } from '@n8n/di';
import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';

import type { McpAuthenticationOption, McpServerTransport } from '../shared/types';
import {
	connectMcpClient,
	getAuthHeaders,
	mapToNodeOperationError,
	tryRefreshOAuth2Token,
} from '../shared/utils';

export async function getTools(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
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
			throw new Error(`MCP Server "${mcpServer.value}" not found in configuration`);
		}
		serverTransport = server.type as McpServerTransport;
		endpointUrl = server.url;
	} else {
		// Manual URL
		serverTransport = this.getNodeParameter('serverTransport') as McpServerTransport;
		endpointUrl = mcpServer.value;
	}

	if (!endpointUrl) {
		return { results: [] };
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

	const result = await client.result.listTools({ cursor: paginationToken });
	const tools = filter
		? result.tools.filter((tool) => tool.name.toLowerCase().includes(filter.toLowerCase()))
		: result.tools;

	return {
		results: tools.map((tool) => ({
			name: tool.name,
			value: tool.name,
			description: tool.description,
			inputSchema: tool.inputSchema,
		})),
		paginationToken: result.nextCursor,
	};
}

export async function getMcpServers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const config = Container.get(GlobalConfig) as any;
	const servers = config.mcp.servers;
	const filtered = filter
		? servers.filter((s: any) => s.name.toLowerCase().includes(filter.toLowerCase()))
		: servers;

	return {
		results: filtered.map((s: any) => ({
			name: s.name,
			value: s.name,
			description: s.url,
		})),
	};
}
