"""
菜品 CRUD 路由
"""
from fastapi import APIRouter, HTTPException
from models import Dish, DishCreate
from firebase_client import db

router = APIRouter(prefix="/api/dishes", tags=["dishes"])

COLLECTION = "dishes"


@router.get("/", response_model=list[Dish])
async def get_all_dishes():
    """获取所有菜品"""
    docs = db.collection(COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


@router.get("/{dish_id}", response_model=Dish)
async def get_dish(dish_id: str):
    """获取单个菜品"""
    doc = db.collection(COLLECTION).document(dish_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="菜品不存在")
    return doc.to_dict()


@router.post("/", response_model=Dish, status_code=201)
async def create_dish(dish_data: DishCreate):
    """新增菜品"""
    # 自动生成 ID
    doc_ref = db.collection(COLLECTION).document()
    dish = Dish(id=doc_ref.id, **dish_data.model_dump())
    doc_ref.set(dish.model_dump())
    return dish


@router.put("/{dish_id}", response_model=Dish)
async def update_dish(dish_id: str, dish_data: Dish):
    """更新菜品"""
    doc_ref = db.collection(COLLECTION).document(dish_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="菜品不存在")
    doc_ref.set(dish_data.model_dump())
    return dish_data


@router.delete("/{dish_id}")
async def delete_dish(dish_id: str):
    """删除菜品"""
    doc_ref = db.collection(COLLECTION).document(dish_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="菜品不存在")
    doc_ref.delete()
    return {"message": "菜品已删除", "id": dish_id}
