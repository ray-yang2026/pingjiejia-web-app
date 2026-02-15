/**
 * API 请求层 — 封装所有后端 API 调用
 */

const API_BASE = '/api';

// ==================== 菜品 API ====================

export async function fetchDishes() {
  const res = await fetch(`${API_BASE}/dishes/`);
  if (!res.ok) throw new Error('获取菜品列表失败');
  return res.json();
}

export async function fetchDish(dishId: string) {
  const res = await fetch(`${API_BASE}/dishes/${dishId}`);
  if (!res.ok) throw new Error('获取菜品详情失败');
  return res.json();
}

export async function createDish(dishData: any) {
  const res = await fetch(`${API_BASE}/dishes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dishData),
  });
  if (!res.ok) throw new Error('创建菜品失败');
  return res.json();
}

// ==================== 订单 API ====================

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders/`);
  if (!res.ok) throw new Error('获取订单列表失败');
  return res.json();
}

export async function fetchOrder(orderId: string) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`);
  if (!res.ok) throw new Error('获取订单详情失败');
  return res.json();
}

export async function createOrder(orderData: {
  customerName: string;
  customerPhone: string;
  eventReason: string;
  address: string;
  daysCount: number;
  startDate: string;
  plans?: any[];
}) {
  const res = await fetch(`${API_BASE}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('创建订单失败');
  return res.json();
}

export async function updateOrderApi(orderId: string, orderData: any) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('更新订单失败');
  return res.json();
}

export async function deleteOrderApi(orderId: string) {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('删除订单失败');
  return res.json();
}

// ==================== 供应商 API ====================

export async function fetchSuppliers() {
  const res = await fetch(`${API_BASE}/suppliers/`);
  if (!res.ok) throw new Error('获取供应商列表失败');
  return res.json();
}

export async function createSupplier(supplierData: any) {
  const res = await fetch(`${API_BASE}/suppliers/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplierData),
  });
  if (!res.ok) throw new Error('创建供应商失败');
  return res.json();
}

export async function updateSupplier(supplierId: string, supplierData: any) {
  const res = await fetch(`${API_BASE}/suppliers/${supplierId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplierData),
  });
  if (!res.ok) throw new Error('更新供应商失败');
  return res.json();
}

export async function deleteSupplier(supplierId: string) {
  const res = await fetch(`${API_BASE}/suppliers/${supplierId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('删除供应商失败');
  return res.json();
}

// ==================== 系统配置 API ====================

export async function fetchConfig(configId: string) {
  const res = await fetch(`${API_BASE}/admin/config/${configId}`);
  if (!res.ok) throw new Error('获取配置失败');
  return res.json();
}

export async function saveConfig(configData: any) {
  const res = await fetch(`${API_BASE}/admin/config/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configData),
  });
  if (!res.ok) throw new Error('保存配置失败');
  return res.json();
}

// ==================== 菜品管理 (扩展) ====================

export async function updateDish(dishId: string, dishData: any) {
  const res = await fetch(`${API_BASE}/dishes/${dishId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dishData),
  });
  if (!res.ok) throw new Error('更新菜品失败');
  return res.json();
}

export async function deleteDish(dishId: string) {
  const res = await fetch(`${API_BASE}/dishes/${dishId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('删除菜品失败');
  return res.json();
}

// ==================== 管理后台扩展 API ====================

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error('获取统计数据失败');
  return res.json();
}

export async function fetchIngredientLibrary() {
  const res = await fetch(`${API_BASE}/admin/ingredients`);
  if (!res.ok) throw new Error('获取原料库失败');
  return res.json();
}

export async function saveIngredientLibrary(item: any) {
  const res = await fetch(`${API_BASE}/admin/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('保存原料失败');
  return res.json();
}

export async function deleteIngredientLibrary(id: string) {
  const res = await fetch(`${API_BASE}/admin/ingredients/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('删除原料失败');
  return res.json();
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('上传图片失败');
  const data = await res.json();
  // 注意：如果本地开发，返回的是相对路径，需要拼接成完整路径或让代理处理
  return data;
}
