"""
订单 CRUD 路由
"""
import time
import math
import random
from fastapi import APIRouter, HTTPException
from models import Order, OrderCreate, OrderStatus, DayPlan, DayPlanSlots, MealSlot
from firebase_client import db
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/orders", tags=["orders"])

COLLECTION = "orders"


@router.get("/", response_model=list[Order])
async def get_all_orders():
    """获取所有订单"""
    docs = db.collection(COLLECTION).stream()
    return [doc.to_dict() for doc in docs]


@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """获取单个订单"""
    doc = db.collection(COLLECTION).document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="订单不存在")
    return doc.to_dict()


@router.post("/", response_model=Order, status_code=201)
async def create_order(order_data: OrderCreate):
    """新增订单"""
    # 生成唯一 ID 和订单号
    order_id = f"ord-{int(time.time() * 1000)}"
    order_number = f"#CRT-{random.randint(10000, 99999)}"

    # 如果 plans 为空，根据 daysCount 和 startDate 自动生成空日程
    plans = order_data.plans
    if not plans:
        plans = []
        try:
            start = datetime.strptime(order_data.startDate, "%Y-%m-%d")
        except ValueError:
            start = datetime.now()
        for i in range(order_data.daysCount):
            day = start + timedelta(days=i)
            plans.append(DayPlan(
                date=day.strftime("%Y-%m-%d"),
                slots=DayPlanSlots(
                    lunch=MealSlot(type="lunch", tableCount=0, dishes=[]),
                    dinner=MealSlot(type="dinner", tableCount=0, dishes=[]),
                )
            ))

    order = Order(
        id=order_id,
        orderNumber=order_number,
        customerName=order_data.customerName,
        customerPhone=order_data.customerPhone,
        eventReason=order_data.eventReason,
        address=order_data.address,
        daysCount=order_data.daysCount,
        startDate=order_data.startDate,
        status=OrderStatus.TO_BE_EXECUTED,
        plans=plans,
    )

    db.collection(COLLECTION).document(order_id).set(order.model_dump())
    return order


@router.put("/{order_id}", response_model=Order)
async def update_order(order_id: str, order_data: Order):
    """更新订单"""
    doc_ref = db.collection(COLLECTION).document(order_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="订单不存在")
    doc_ref.set(order_data.model_dump())
    return order_data


@router.delete("/{order_id}")
async def delete_order(order_id: str):
    """删除订单"""
    doc_ref = db.collection(COLLECTION).document(order_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="订单不存在")
    doc_ref.delete()
    return {"message": "订单已删除", "id": order_id}
