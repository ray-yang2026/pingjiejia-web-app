"""
萍姐家流动餐 — FastAPI 后端入口
"""
import os

# 本地开发加载 .env（Vercel 环境会自动注入环境变量）
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import dishes, orders, suppliers, admin

app = FastAPI(
    title="萍姐家流动餐 API",
    description="流动宴席管理系统后端接口",
    version="1.0.0",
)

# 挂载静态文件目录 (上传的图片 — 本地开发用，Vercel 上使用 Firebase Storage)
try:
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")
except Exception:
    pass

# CORS 配置 — 开发环境允许前端 localhost:3000 访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(dishes.router)
app.include_router(orders.router)
app.include_router(suppliers.router)
app.include_router(admin.router)


@app.get("/")
async def root():
    return {"message": "萍姐家流动餐 API 运行中", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
