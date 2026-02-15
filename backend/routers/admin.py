import os
import uuid
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, UploadFile, File
from models import SystemConfig, DashboardStats, IngredientLibraryItem, Order
from firebase_client import db, bucket

router = APIRouter(prefix="/api/admin", tags=["admin"])

CONFIG_COLLECTION = "system_config"
INGREDIENTS_COLLECTION = "ingredient_library"

# ==================== 认证 API ====================

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")


class LoginRequest(BaseModel):
    password: str


@router.post("/login")
async def admin_login(body: LoginRequest):
    """简易密码登录"""
    if body.password == ADMIN_PASSWORD:
        # 简易 token（生产环境应使用 JWT）
        token = str(uuid.uuid4())
        return {"success": True, "token": token}
    raise HTTPException(status_code=401, detail="密码错误")


# ==================== 仪表盘 API ====================


@router.get("/stats")
async def get_dashboard_stats():
    """获取仪表盘统计数据（含近期订单）"""
    orders = db.collection("orders").get()
    dishes = db.collection("dishes").get()
    suppliers = db.collection("suppliers").get()

    order_list = [o.to_dict() for o in orders]
    active_orders = [o for o in order_list if o.get("status") == "待执行"]

    # 按 startDate 降序排列取最近 5 条
    sorted_orders = sorted(order_list, key=lambda x: x.get("startDate", ""), reverse=True)
    recent_orders = sorted_orders[:5]

    return {
        "totalOrders": len(order_list),
        "totalDishes": len(dishes),
        "totalSuppliers": len(suppliers),
        "activeOrders": len(active_orders),
        "recentOrders": recent_orders,
    }


# ==================== 系统配置 API ====================


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

# 本地上传目录（当 Firebase Storage 未配置时的回退方案）
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
try:
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR, exist_ok=True)
except Exception:
    pass


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """上传图片并返回访问路径（优先 Firebase Storage，不可用时本地存储）"""
    # 验证文件类型
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only images are allowed")

    file_ext = os.path.splitext(file.filename or "image.jpg")[1]
    filename = f"{uuid.uuid4()}{file_ext}"
    file_bytes = await file.read()

    # 优先使用 Firebase Storage
    if bucket is not None:
        try:
            blob = bucket.blob(f"dish-images/{filename}")
            blob.upload_from_string(file_bytes, content_type=file.content_type)
            blob.make_public()
            return {"imageUrl": blob.public_url}
        except Exception as e:
            print(f"Firebase Storage upload failed, falling back to local: {e}")

    # 回退到本地存储
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    return {"imageUrl": f"/uploads/{filename}"}
