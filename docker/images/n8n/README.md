![n8n.io - Workflow Automation](https://user-images.githubusercontent.com/65276001/173571060-9f2f6d7b-bac0-43b6-bdb2-001da9694058.png)

# n8n - 技术团队的安全工作流自动化

n8n 是一个工作流自动化平台，为技术团队提供了兼具代码灵活性和无代码速度的体验。拥有 400 多个集成、原生的 AI 能力以及公平代码（fair-code）许可，n8n 让您可以构建强大的自动化流程，同时保持对数据和部署的完全控制。

![n8n.io - 截图](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-screenshot-readme.png)

## 关键能力

- **按需编写代码**：编写 JavaScript/Python，添加 npm 包，或使用可视化界面
- **原生 AI 平台**：基于 LangChain 构建 AI 代理工作流，使用您自己的数据和模型
- **完全掌控**：使用我们的公平代码许可进行自托管，或使用我们的 [云服务](https://app.n8n.cloud/login)
- **企业级就绪**：高级权限管理、SSO 和气隙（air-gapped）部署
- **活跃社区**：400+ 集成和 900+ 现成的 [模板](https://n8n.io/workflows)

## 目录

- [n8n - 工作流自动化工具](#n8n---工作流自动化工具)
  - [关键能力](#关键能力)
  - [目录](#目录)
  - [演示](#演示)
  - [可用集成](#可用集成)
  - [文档](#文档)
  - [在 Docker 中启动 n8n](#在-docker-中启动-n8n)
  - [配合 PostgreSQL 使用](#配合-postgresql-使用)
  - [使用文件传递敏感数据](#使用文件传递敏感数据)
  - [示例服务器设置](#示例服务器设置)
  - [更新](#更新)
    - [拉取最新（稳定）版本](#拉取最新稳定版本)
    - [拉取特定版本](#拉取特定版本)
    - [拉取下一个（不稳定）版本](#拉取下一个不稳定版本)
    - [使用 Docker Compose 更新](#使用-docker-compose-更新)
  - [设置时区](#设置时区)
  - [构建 Docker 镜像](#构建-docker-镜像)
  - [n8n 是什么意思以及如何发音？](#n8n-是什么意思以及如何发音)
  - [支持](#支持)
  - [招聘](#招聘)
  - [许可证](#许可证)

## 演示

这个 [:tv: 短视频 (< 4 分钟)](https://www.youtube.com/watch?v=RpjQTGKm-ok) 介绍了在 n8n 中创建工作流的关键概念。

## 可用集成

n8n 拥有 200+ 个不同的节点用于自动化工作流。完整列表可以在这里找到：[https://n8n.io/integrations](https://n8n.io/integrations)。

## 文档

官方 n8n 文档位于 [https://docs.n8n.io](https://docs.n8n.io)。

更多信息和示例工作流可在官网获取：[https://n8n.io](https://n8n.io)。

## 在 Docker 中启动 n8n

在终端中输入以下命令：

```bash
docker volume create n8n_data

docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n
```

此命令将下载所需的 n8n 镜像并启动容器。
然后您可以通过打开以下地址访问 n8n：
[http://localhost:5678](http://localhost:5678)

为了在容器重启之间保存您的工作，它还挂载了一个 docker 卷 `n8n_data`。工作流数据保存在用户文件夹 (`/home/node/.n8n`) 中的 SQLite 数据库中。该文件夹还包含重要数据，如 webhook URL 和用于保护凭据的加密密钥。

如果启动时找不到此数据，n8n 会自动创建一个新密钥，现有的凭据将无法再解密。

## 配合 PostgreSQL 使用

默认情况下，n8n 使用 SQLite 保存凭据、过去的执行记录和工作流。但是，n8n 也支持使用 PostgreSQL。

> **警告**：即使使用不同的数据库，持久化 `/home/node/.n8n` 文件夹仍然很重要，因为它包含基本的 n8n 用户数据，包括用于凭据的加密密钥。

在以下命令中，将占位符（用尖括号表示，例如 `<POSTGRES_USER>`）替换为实际数据：

```bash
docker volume create n8n_data

docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 -e DB_TYPE=postgresdb \
 -e DB_POSTGRESDB_DATABASE=<POSTGRES_DATABASE> \
 -e DB_POSTGRESDB_HOST=<POSTGRES_HOST> \
 -e DB_POSTGRESDB_PORT=<POSTGRES_PORT> \
 -e DB_POSTGRESDB_USER=<POSTGRES_USER> \
 -e DB_POSTGRESDB_SCHEMA=<POSTGRES_SCHEMA> \
 -e DB_POSTGRESDB_PASSWORD=<POSTGRES_PASSWORD> \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n
```

A full working setup with docker-compose can be found [here](https://github.com/n8n-io/n8n-hosting/blob/main/docker-compose/withPostgres/README.md).

## Passing sensitive data using files

To avoid passing sensitive information via environment variables, "\_FILE" may be appended to some environment variable names. n8n will then load the data from a file with the given name. This makes it possible to load data easily from Docker and Kubernetes secrets.

The following environment variables support file input:

- DB_POSTGRESDB_DATABASE_FILE
- DB_POSTGRESDB_HOST_FILE
- DB_POSTGRESDB_PASSWORD_FILE
- DB_POSTGRESDB_PORT_FILE
- DB_POSTGRESDB_USER_FILE
- DB_POSTGRESDB_SCHEMA_FILE

## Example server setups

Example server setups for a range of cloud providers and scenarios can be found in the [Server Setup documentation](https://docs.n8n.io/hosting/installation/server-setups/).

## Updating

Before you upgrade to the latest version make sure to check here if there are any breaking changes which may affect you: [Breaking Changes](https://github.com/n8n-io/n8n/blob/master/packages/cli/BREAKING-CHANGES.md)

From your Docker Desktop, navigate to the Images tab and select Pull from the context menu to download the latest n8n image.

You can also use the command line to pull the latest, or a specific version:

### Pull latest (stable) version

```bash
docker pull docker.n8n.io/n8nio/n8n
```

### Pull specific version

```bash
docker pull docker.n8n.io/n8nio/n8n:0.220.1
```

### Pull next (unstable) version

```bash
docker pull docker.n8n.io/n8nio/n8n:next
```

Stop the container and start it again:

1. Get the container ID:

```bash
docker ps -a
```

2. Stop the container with ID container_id:

```bash
docker stop [container_id]
```

3. Remove the container (this does not remove your user data) with ID container_id:

```bash
docker rm [container_id]
```

4. Start the new container:

```bash
docker run --name=[container_name] [options] -d docker.n8n.io/n8nio/n8n
```

### Updating with Docker Compose

If you run n8n using a Docker Compose file, follow these steps to update n8n:

```bash
# Pull latest version
docker compose pull

# Stop and remove older version
docker compose down

# Start the container
docker compose up -d
```

## Setting the timezone

To specify the timezone n8n should use, the environment variable `GENERIC_TIMEZONE` can
be set. One example where this variable has an effect is the Schedule node.

The system's timezone can be set separately with the environment variable `TZ`.
This controls the output of certain scripts and commands such as `$ date`.

For example, to use the same timezone for both:

```bash
docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="Europe/Berlin" \
 -e TZ="Europe/Berlin" \
 docker.n8n.io/n8nio/n8n
```

For more information on configuration and environment variables, please see the [n8n documentation](https://docs.n8n.io/hosting/configuration/environment-variables/).


Here's the refined version with good Markdown formatting, ready for your `README`:

## Build Docker Image

**Important Note for Releases 1.101.0 and Later:**
Building the n8n Docker image now requires a pre-compiled n8n application.

### Recommended Build Process:

For the simplest approach that handles both n8n compilation and Docker image creation, run from the root directory:

```bash
pnpm build:docker
```

### Alternative Builders:

If you are using a different build system that requires a separate build context, first compile the n8n application:

```bash
pnpm run build:deploy
```

Then, ensure your builder's context includes the `compiled` directory generated by this command.


## What does n8n mean and how do you pronounce it?

**Short answer:** It means "nodemation" and it is pronounced as n-eight-n.

**Long answer:** I get that question quite often (more often than I expected) so I decided it is probably best to answer it here. While looking for a good name for the project with a free domain I realized very quickly that all the good ones I could think of were already taken. So, in the end, I chose nodemation. "node-" in the sense that it uses a Node-View and that it uses Node.js and "-mation" for "automation" which is what the project is supposed to help with.
However, I did not like how long the name was and I could not imagine writing something that long every time in the CLI. That is when I then ended up on "n8n". Sure it does not work perfectly but neither does it for Kubernetes (k8s) and I did not hear anybody complain there. So I guess it should be ok.

## Support

If you need more help with n8n, you can ask for support in the [n8n community forum](https://community.n8n.io). This is the best source of answers, as both the n8n support team and community members can help.

## Jobs

If you are interested in working for n8n and so shape the future of the project check out our [job posts](https://jobs.ashbyhq.com/n8n).

## License

You can find the license information [here](https://github.com/n8n-io/n8n/blob/master/README.md#license).
