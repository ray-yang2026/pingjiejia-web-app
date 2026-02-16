
export enum OrderStatus {
  TO_BE_EXECUTED = '待执行',
  COMPLETED = '已完成'
}

// ==================== 原料相关 ====================

/** 原材料库中的项（支持层级） */
export interface IngredientLibraryItem {
  id: string;
  name: string;
  level: 1 | 2;           // 1 为大类，2 为子类
  parentId?: string;       // level 2 时指向 level 1 的 id
}

/** 菜品关联的原材料（带分量） */
export interface Ingredient {
  libId?: string;          // 指向 IngredientLibraryItem.id（旧数据可能没有）
  name: string;
  amount: string;
  category: string;
  detail?: string;         // 兼容旧数据
}

// ==================== 菜品 ====================

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients?: Ingredient[];
}

export interface DishCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients?: Ingredient[];
}

// ==================== 订单 ====================

export interface MealSlot {
  type: 'lunch' | 'dinner';
  tableCount: number;
  dishes: Array<{ dishId: string; quantity: number }>;
}

export interface DayPlan {
  date: string;
  slots: {
    lunch?: MealSlot;
    dinner?: MealSlot;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  eventReason: string;
  address: string;
  daysCount: number;
  startDate: string;
  status: OrderStatus;
  plans: DayPlan[];
}

export interface OrderCreate {
  customerName: string;
  customerPhone: string;
  eventReason: string;
  address?: string;
  daysCount: number;
  startDate: string;
  plans?: DayPlan[];
}

// ==================== 供应商 ====================

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactName?: string;
  phone: string;
  note?: string;
}

// ==================== 系统配置 ====================

export interface SystemConfig {
  id: string;
  label: string;
  values: string[];
}

// ==================== 仪表盘 ====================

export interface DashboardStats {
  totalOrders: number;
  totalDishes: number;
  totalSuppliers: number;
  activeOrders: number;
  recentOrders?: Order[];
}
