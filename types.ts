
export enum OrderStatus {
  TO_BE_EXECUTED = '待执行',
  COMPLETED = '已完成'
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients?: Array<{ 
    name: string; 
    amount: string; 
    category: '肉类' | '菜类' | '佐料类' | '其他'; 
    detail?: string 
  }>;
}

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
