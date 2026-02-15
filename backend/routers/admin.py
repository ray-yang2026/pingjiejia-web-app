import os
import shutil
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File
from models import SystemConfig, DashboardStats, IngredientLibraryItem
from firebase_client import db

router = APIRouter(prefix="/api/admin", tags=["admin"])

CONFIG_COLLECTION = "system_config"
INGREDIENTS_COLLECTION = "ingredient_library"


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """获取仪表盘统计数据"""
    orders = db.collection("orders").get()
    dishes = db.collection("dishes").get()
    suppliers = db.collection("suppliers").get()

    active_orders = [o for o in orders if o.to_dict().get("status") == "待执行"]

    return DashboardStats(
        totalOrders=len(orders),
        totalDishes=len(dishes),
        totalSuppliers=len(suppliers),
        activeOrders=len(active_orders)
    )


@router.get("/config", response_model=list[SystemConfig])
async def get_all_configs():
    """获取所有系统配置"""
    docs = db.collection(CONFIG_COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


@router.get("/config/{config_id}", response_model=SystemConfig)
async def get_config(config_id: str):
    """获取指定配置 (如 dish_categories)"""
    doc = db.collection(CONFIG_COLLECTION).document(config_id).get()
    if not doc.exists:
        return SystemConfig(id=config_id, label="Unknown", values=[])
    return doc.to_dict()


@router.post("/config", response_model=SystemConfig)
async def save_config(config: SystemConfig):
    """保存/更新配置"""
    db.collection(CONFIG_COLLECTION).document(config.id).set(config.model_dump())
    return config


# ==================== 原材料库 API ====================

@router.get("/ingredients", response_model=list[IngredientLibraryItem])
async def get_all_ingredients():
    """获取原材料库"""
    docs = db.collection(INGREDIENTS_COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


@router.post("/ingredients", response_model=IngredientLibraryItem)
async def add_ingredient(item: IngredientLibraryItem):
    """新增原材料"""
    db.collection(INGREDIENTS_COLLECTION).document(item.id).set(item.model_dump())
    return item


@router.delete("/ingredients/{item_id}")
async def delete_ingredient(item_id: str):
    """删除原材料"""
    db.collection(INGREDIENTS_COLLECTION).document(item_id).delete()
    return {"status": "ok"}


# ==================== 图片上传 API ====================

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """上传图片并返回访问路径"""
    # 验证文件类型
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only images are allowed")

    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 返回相对路径（前端代理到后端）
    return {"imageUrl": f"/uploads/{filename}"}
