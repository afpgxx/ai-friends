# AI Friends — 在线 AI 好友

> 创建你自己的 AI 角色（头像 / 背景 / 音色 / 人设），与它**流式对话**，支持**浏览器端语音输入**与语音合成，并具备**跨会话长期记忆**与**知识库检索（RAG）**。

一个自托管的 AI 陪伴类应用。后端 Django 提供用户、角色、好友关系与对话接口；前端 Vue 3 负责交互与流式渲染；对话由 **LangGraph 编排的 ReAct Agent** 驱动，可从 **LanceDB 知识库**中检索文档后作答。

---

## 功能

- **用户体系**：注册 / 登录 / 登出 / Token 刷新 / 资料与头像编辑
- **AI 角色创建**：自定义名称、人设、头像、对话背景图与音色
- **流式对话**：基于 SSE 逐字返回，前端实时渲染回复
- **语音交互**：浏览器端 VAD 自动检测说话起止 → 服务端 ASR 转写，并支持语音合成输出
- **知识库检索（RAG）**：对话中 Agent 可自主调用知识库检索工具，从文档中召回相关内容后作答
- **长期记忆**：对话记忆由独立 LangGraph 图维护，跨会话保持一致
- **好友关系**：AI 角色之间的好友列表、消息历史与消息删除
- **用量统计**：记录每轮对话的 token 消耗

---

## 技术栈

**前端**

| 用途 | 技术 |
|---|---|
| 框架 | Vue 3.5 · Vue Router 5 · Pinia 3 |
| 构建 | Vite 7 |
| 样式 | TailwindCSS 4 · DaisyUI 5 |
| 流式对话 | `@microsoft/fetch-event-source`（SSE） |
| 语音检测 | `@ricky0123/vad-web`（浏览器端 VAD） |
| 图片裁剪 | Croppie |

**后端**

| 用途 | 技术 |
|---|---|
| Web 框架 | Django |
| Agent 编排 | LangGraph（StateGraph + ToolNode + 条件边） |
| LLM / ASR / Embedding | 阿里云百炼平台 |
| 向量库 | LanceDB |
| 数据库 | SQLite |

---

## 架构

```
┌──────────────────────────────────────────────┐
│  Vue 3 SPA (frontend/)                       │
│  ├─ 路由守卫：needLogin + Pinia 用户态        │
│  ├─ SSE 流式渲染 AI 回复                      │
│  └─ 浏览器端 VAD 采集语音                     │
└───────────────────┬──────────────────────────┘
                    │ HTTP / SSE
┌───────────────────▼──────────────────────────┐
│  Django (backend/)                           │
│  ├─ web/views/user/       用户与鉴权          │
│  ├─ web/views/create/     AI 角色与音色       │
│  ├─ web/views/friend/     好友与消息          │
│  │   └─ message/chat/     LangGraph 对话图 ★  │
│  │   └─ message/memory/   LangGraph 记忆图    │
│  │   └─ message/asr/      语音转写（百炼）     │
│  └─ web/documents/        文档入库与向量检索 ★ │
└────────┬──────────────────────────┬──────────┘
         │                          │
   ┌─────▼──────┐            ┌──────▼───────┐
   │ 阿里云百炼  │            │   LanceDB    │
   │ LLM/ASR/EMB │            │  知识库向量   │
   └────────────┘            └──────────────┘
```

---

## 对话链路：LangGraph 编排的 ReAct Agent ★

对话图定义在 `backend/web/views/friend/message/chat/graph.py`，是一个标准的 **ReAct 循环**：

```
START ──▶ agent ──(有 tool_calls?)──▶ tools ──▶ agent ──▶ END
            │                                              ▲
            └────────────── 无 tool_calls ─────────────────┘
```

- **状态**：`AgentState`，消息列表使用 `add_messages` reducer 累加
- **节点**：`agent`（调用 LLM）+ `tools`（LangGraph 内置 `ToolNode`）
- **条件边**：`should_continue` 检查最后一条消息是否带 `tool_calls`，有则转入工具节点，无则结束
- **工具**：`get_time`（获取当前时间）、`search_knowledge_base`（知识库检索）

这意味着**检索不是硬编码在前置步骤里的，而是由 LLM 自主决定是否调用**——属于 Agentic RAG 的形态。

**LLM 调用**（通过百炼的 OpenAI 兼容接口）：

```python
ChatOpenAI(
    model='deepseek-v4-pro',
    openai_api_key=os.getenv('API_KEY'),      # 密钥走环境变量
    openai_api_base=os.getenv('API_BASE'),
    streaming=True,
    model_kwargs={"stream_options": {"include_usage": True}},   # 统计 token 消耗
    extra_body={"thinking": {"type": "disabled"}},              # 关闭思考模式以降延迟
)
```

---

## 知识库检索（RAG）实现 ★

**文档入库**（`web/documents/utils/insert_documents.py`）：

```
TextLoader 加载文档
  → RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50) 切片
  → CustomEmbeddings 向量化（对接百炼 Embedding 接口）
  → 写入 LanceDB 表 my_knowledge_base
```

**在线检索**（`search_knowledge_base` 工具）：

```
LLM 决定调用 → 查询向量化 → LanceDB similarity_search(k=3)
  → 召回片段拼接为上下文 → 返回给 Agent → Agent 基于上下文作答
```

同时 `CustomEmbeddings` 实现了 LangChain 的 Embeddings 接口，使入库与检索共用同一套向量化逻辑，避免两侧模型不一致。

---

## 目录结构

```
.
├── backend/                     # Django 后端
│   ├── manage.py
│   ├── backend/                 # 项目配置（settings / urls / asgi / wsgi）
│   └── web/                     # 主应用
│       ├── models/              # user / character / friend 数据模型
│       ├── migrations/
│       ├── templates/
│       ├── documents/           # 知识库
│       │   ├── data.txt
│       │   ├── lancedb_storage/ # LanceDB 数据目录
│       │   └── utils/
│       │       ├── custom_embeddings.py   # 自定义 Embedding
│       │       └── insert_documents.py    # 文档切片与入库
│       └── views/               # 按功能分目录的视图
│           ├── user/account/    # login / logout / register / refresh_token
│           ├── user/profile/
│           ├── create/character/# 角色增删改查 + voice
│           ├── friend/          # 好友列表、添加、删除
│           │   └── message/     # chat / memory / asr / get_history
│           └── homepage/
└── frontend/                    # Vue 3 前端
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js
        ├── router/index.js      # 路由 + 登录守卫
        ├── stores/user.js       # Pinia 用户状态
        ├── js/http/             # api.js / streamApi.js（SSE 封装）
        ├── js/utils/            # base64 转文件等
        ├── components/          # NavBar / Character / ChatField 等
        └── views/               # 页面级组件
```

---

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 20.19+ 或 22.12+
- 阿里云百炼平台账号（获取 API Key 与兼容接口地址）

### 后端

```bash
cd backend

python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

如需启用知识库检索，先准备文档并入库：

```bash
# 1) 把你的文档内容放入 web/documents/data.txt
# 2) 执行入库
python -c "from web.documents.utils.insert_documents import insert_documents; insert_documents()"
```

### 前端

```bash
cd frontend
npm install
npm run dev            # 开发服务器（默认 http://localhost:5173）
npm run build          # 生产构建
```

### 配置

在 `backend/` 下创建 `.env`（并确保已加入 `.gitignore`）：

```
API_KEY=<阿里云百炼 API Key>
API_BASE=<百炼兼容接口地址>
SECRET_KEY=<Django SECRET_KEY>
```

---

## Roadmap

- [ ] 补充界面截图与演示 GIF
- [ ] 补齐后端单元测试
- [ ] 知识库支持多文档与增量入库（当前为单文件 `data.txt`）
- [ ] 检索增加重排序（Rerank）以提升召回精度
- [ ] 记忆系统支持查看、编辑与清理
- [ ] token 用量与成本的可视化统计

