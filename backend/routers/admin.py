"""
系统配置管理路由 (Admin)
"""
from fastapi import APIRouter, HTTPException
from models import SystemConfig
from firebase_client import db

router = APIRouter(prefix="/api/admin/config", tags=["admin"])

COLLECTION = "system_config"


@router.get("/", response_model=list[SystemConfig])
async def get_all_configs():
    """获取所有系统配置"""
    docs = db.collection(COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


@router.get("/{config_id}", response_model=SystemConfig)
async def get_config(config_id: str):
    """获取指定配置 (如 dish_categories)"""
    doc = db.collection(COLLECTION).document(config_id).get()
    if not doc.exists:
        # 如果不存在，返回默认空值或者 404
        # 为了方便前端，可以返回默认结构
        return SystemConfig(id=config_id, label="Unknown", values=[])
    return doc.to_dict()


@router.post("/", response_model=SystemConfig)
async def save_config(config: SystemConfig):
    """保存/更新配置"""
    db.collection(COLLECTION).document(config.id).set(config.model_dump())
    return config
