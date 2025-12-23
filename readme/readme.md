
## 系统文档（中文）

**概览**
- n8n 是一个开源的工作流自动化平台，支持可视化编排与可扩展的代码能力
- 采用 pnpm 管理的 Monorepo 架构，后端为 Node.js + TypeScript，前端为 Vue 3
- 内置大量集成与 AI 能力，支持自托管与企业级特性

**目录结构**
- `packages/cli` 后端服务与 CLI 入口
- `packages/core` 工作流执行引擎与核心能力
- `packages/workflow` 工作流数据结构与接口
- `packages/frontend/editor-ui` 前端编辑器（Vue 3）
- `packages/nodes-base` 内置节点
- `packages/@n8n/n8n-nodes-langchain` AI/LangChain 相关节点
- `packages/@n8n/config` 配置系统（环境变量映射）

**环境要求**
- `Node.js >= 22.16`（推荐使用 Homebrew 安装 `node@22` 并将其加入 `PATH`）
- `pnpm >= 10.2`（建议使用 `corepack` 管理）
- macOS 无额外构建工具要求；Linux 需安装基本编译工具

**快速开始（本地源码编译运行）**
- 安装依赖
  - `corepack enable && corepack prepare pnpm@10.22.0 --activate`
  - `pnpm install`
- 构建
  - `pnpm build`
- 开发模式
  - 全栈开发：`pnpm dev`
  - 仅后端：`pnpm dev:be`
  - 仅前端编辑器：`pnpm dev:fe:editor`
- 生产模式验证
  - `pnpm build && pnpm start`
  - 默认访问地址 `http://localhost:5678`

**常用命令**
- 构建所有包：`pnpm build`
- 仅类型检查：`pnpm typecheck`
- 代码质量：`pnpm lint`、`pnpm format`
- 测试：`pnpm test`
- 监视与热重载（开发）：`pnpm dev`

**AI 开发与说明**
- 专为 AI 助手准备的开发说明见根目录 `AGENTS.md`，无需额外为 Trae 配置
- AI 相关模块主要在 `@n8n/n8n-nodes-langchain`，开发模式可用：`pnpm dev:ai`
- 平台自带 AI 工作流构建能力与多模型支持，详见文档与示例

**配置与环境变量（常用）**
- 服务基础
  - `N8N_HOST` 默认 `localhost`
  - `N8N_PORT` 默认 `5678`
  - `N8N_PROTOCOL` 默认 `http`
  - `N8N_PATH` 部署路径，默认 `/`
- 数据库（默认 SQLite）
  - `DB_TYPE` 默认 `sqlite`（支持 `postgresdb`）
  - `DB_SQLITE_DATABASE` 默认 `database.sqlite`
  - PostgreSQL 相关：`DB_POSTGRESDB_HOST`、`DB_POSTGRESDB_PORT`、`DB_POSTGRESDB_USER`、`DB_POSTGRESDB_PASSWORD`、`DB_POSTGRESDB_DATABASE`、`DB_POSTGRESDB_SCHEMA`、`DB_POSTGRESDB_SSL_*`
- 日志与其他
  - `N8N_DEFAULT_LOCALE` 默认 `en`
  - 更多配置映射见 `packages/@n8n/config/src` 下各 `*.config.ts`

**常见问题**
- `turbo: command not found` 或 `node_modules missing`：请先执行 `pnpm install`
- Node 版本不匹配：按需升级到 `Node.js >= 22.16`（`brew install node@22` 并更新 `PATH`）
- `sqlite3` 原生绑定缺失（构建时报 `Could not locate the bindings file`）：
  - 确保使用 Node 22
  - 执行 `pnpm rebuild sqlite3`
  - 若仍报错，删除 `node_modules` 与 `.turbo` 后重新 `pnpm install && pnpm build`
- 仅后端/仅前端开发：使用 `pnpm dev:be` 或 `pnpm dev:fe:editor`

**贡献与测试**
- 贡献流程与详细开发指南见 `CONTRIBUTING.md`
- 测试套件
  - 后端：Jest（`pnpm test`、`pnpm test:unit`、`pnpm test:integration`）
  - 前端：Vitest
  - E2E：Playwright（参见 `packages/testing/playwright/README.md`）

**许可与部署**
- 采用可持续使用许可（Sustainable Use License）与企业许可，支持自托管与扩展
- 生产部署请参考官方文档与 Docker 镜像说明

**提示**
- 项目严格使用 `pnpm`，根目录脚本会阻止 `npm` 安装（`scripts/block-npm-install.js`）
- 构建与任务编排通过 `turbo` 协调，遵循 monorepo 工作流
