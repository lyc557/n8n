import { z } from 'zod';

import { Config, Env } from '../decorators';

const McpServerTypeSchema = z.enum(['sse', 'httpStreamable']);

const McpServerSchema = z.object({
	name: z.string(),
	type: McpServerTypeSchema,
	url: z.string(),
});

const McpServersSchema = z.array(McpServerSchema);

@Config
export class McpConfig {
	@Env('N8N_MCP_SERVERS', McpServersSchema)
	servers: z.infer<typeof McpServersSchema> = [];
}
