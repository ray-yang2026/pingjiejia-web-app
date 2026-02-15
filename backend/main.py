"""
萍姐家流动餐 — FastAPI 后端入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import dishes, orders

app = FastAPI(
    title="萍姐家流动餐 API",
    description="流动宴席管理系统后端接口",
    version="1.0.0",
)

# CORS 配置 — 开发环境允许前端 localhost:3000 访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(dishes.router)
app.include_router(orders.router)


@app.get("/")
async def root():
    return {"message": "萍姐家流动餐 API 运行中", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
