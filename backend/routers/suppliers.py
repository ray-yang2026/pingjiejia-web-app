"""
供应商管理路由
"""
import time
import random
from fastapi import APIRouter, HTTPException
from models import Supplier
from firebase_client import db

router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])

COLLECTION = "suppliers"


@router.get("/", response_model=list[Supplier])
async def get_all_suppliers():
    """获取所有供应商"""
    docs = db.collection(COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


@router.post("/", response_model=Supplier, status_code=201)
async def create_supplier(supplier_data: Supplier):
    """创建供应商 (ID 前端不传则自动生成，或者前端负责生成)
    这里假设 ID 由后端生成如果前端没传，但 model 定义 id 是必填。
    通常我们定义 Create Model 不带 ID。
    为保持简单，这里假设前端传了 ID 或者我们在 model 里改 optional。
    但在 models.py 里 id 是必填。所以前端需要传，或者我们在这里 override。
    """
    # 简单的 ID 生成逻辑如果传入的 ID 是空
    if not supplier_data.id:
        supplier_data.id = f"sup-{int(time.time()*1000)}"
    
    db.collection(COLLECTION).document(supplier_data.id).set(supplier_data.model_dump())
    return supplier_data


@router.put("/{supplier_id}", response_model=Supplier)
async def update_supplier(supplier_id: str, supplier_data: Supplier):
    """更新供应商"""
    doc_ref = db.collection(COLLECTION).document(supplier_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="供应商不存在")
    
    # 确保 ID 一致
    supplier_data.id = supplier_id
    doc_ref.set(supplier_data.model_dump())
    return supplier_data


@router.delete("/{supplier_id}")
async def delete_supplier(supplier_id: str):
    """删除供应商"""
    doc_ref = db.collection(COLLECTION).document(supplier_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="供应商不存在")
    doc_ref.delete()
    return {"message": "供应商已删除", "id": supplier_id}
