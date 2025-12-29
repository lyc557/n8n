cd packages/@n8n/task-runner-python
# 安装 Poetry（如果未安装，全局安装）
pip install poetry  # 或 brew install poetry（macOS）

# 进入目录
cd /Users/yangcailu/chengtay_code/n8n/packages/@n8n/task-runner-python

# 创建/安装虚拟环境和依赖（基于 pyproject.toml）
poetry install

# 激活 venv（可选，手动激活以测试）
poetry shell
