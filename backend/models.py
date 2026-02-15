"""
Pydantic 数据模型 — 对应前端 types.ts
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


class OrderStatus(str, Enum):
    TO_BE_EXECUTED = "待执行"
    COMPLETED = "已完成"


class Ingredient(BaseModel):
    """菜品原料"""
    name: str
    amount: str
    category: Literal["肉类", "菜类", "佐料类", "其他"]
    detail: Optional[str] = None


class Dish(BaseModel):
    """菜品"""
    id: str
    name: str
    description: str
    price: float
    category: str
    imageUrl: str
    ingredients: Optional[list[Ingredient]] = None


class DishInSlot(BaseModel):
    """餐次中的菜品选择"""
    dishId: str
    quantity: int


class MealSlot(BaseModel):
    """午宴 / 晚宴"""
    type: Literal["lunch", "dinner"]
    tableCount: int = 0
    dishes: list[DishInSlot] = []


class DayPlanSlots(BaseModel):
    """一天的午/晚宴安排"""
    lunch: Optional[MealSlot] = None
    dinner: Optional[MealSlot] = None


class DayPlan(BaseModel):
    """单日排期"""
    date: str
    slots: DayPlanSlots


class Order(BaseModel):
    """订单"""
    id: str
    orderNumber: str
    customerName: str
    customerPhone: str
    eventReason: str
    address: str = ""
    daysCount: int
    startDate: str
    status: OrderStatus = OrderStatus.TO_BE_EXECUTED
    plans: list[DayPlan] = []


class OrderCreate(BaseModel):
    """创建订单时的请求体（id 和 orderNumber 由后端生成）"""
    customerName: str
    customerPhone: str
    eventReason: str
    address: str = ""
    daysCount: int
    startDate: str
    plans: list[DayPlan] = []


class DishCreate(BaseModel):
    """创建菜品时的请求体（id 由后端生成）"""
    name: str
    description: str
    price: float
    category: str
    imageUrl: str
    ingredients: Optional[list[Ingredient]] = None
