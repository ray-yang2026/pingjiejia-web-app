"""
Pydantic 数据模型 — 对应前端 types.ts
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


class OrderStatus(str, Enum):
    TO_BE_EXECUTED = "待执行"
    COMPLETED = "已完成"


class IngredientLibraryItem(BaseModel):
    """原材料库中的项（支持层级）"""
    id: str
    name: str
    level: int  # 1 为大类，2 为子类
    parentId: Optional[str] = None  # 如果是 level 2，指向 level 1 的 id


class Ingredient(BaseModel):
    """菜品关联的原材料（带分量）"""
    libId: Optional[str] = None  # 指向 IngredientLibraryItem.id（旧数据可能没有）
    name: str
    amount: str
    category: str
    detail: Optional[str] = None  # 兼容旧数据


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


class Supplier(BaseModel):
    """供应商"""
    id: str
    name: str
    category: str
    contactName: Optional[str] = None
    phone: str
    note: Optional[str] = None


class SystemConfig(BaseModel):
    """系统配置项 (如菜品分类、事由)"""
    id: str
    label: str
    values: list[str]


class DashboardStats(BaseModel):
    """仪表盘统计数据"""
    totalOrders: int
    totalDishes: int
    totalSuppliers: int
    activeOrders: int
