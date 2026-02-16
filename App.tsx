
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import OrderListPage from './pages/OrderListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import SchedulePage from './pages/SchedulePage';
import MenuSelectionPage from './pages/MenuSelectionPage';
import DishDetailPage from './pages/DishDetailPage';
import SharePreviewPage from './pages/SharePreviewPage';
import RecipeListPage from './pages/RecipeListPage';
import MaterialListPage from './pages/MaterialListPage';
import { Order, Dish } from './types';
import { fetchOrders, updateOrderApi, fetchDishes } from './apiService';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  // 启动时从后端加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          fetchOrders(),
          fetchDishes(),
        ]);
        if (results[0].status === 'fulfilled') setOrders(results[0].value);
        else console.error('加载订单失败:', results[0].reason);
        if (results[1].status === 'fulfilled') setDishes(results[1].value);
        else console.error('加载菜品失败:', results[1].reason);
      } catch (err) {
        console.error('加载数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = async (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    try {
      await updateOrderApi(updatedOrder.id, updatedOrder);
    } catch (err) {
      console.error('同步订单到后端失败:', err);
    }
  };

  const refreshOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('刷新订单失败:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-background-light dark:bg-background-dark max-w-md mx-auto shadow-2xl relative overflow-hidden">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/orders" element={<OrderListPage orders={orders} updateOrder={updateOrder} />} />
          <Route path="/recipes" element={<RecipeListPage dishes={dishes} />} />
          <Route path="/new-order" element={<CustomerFormPage addOrder={addOrder} />} />
          <Route path="/edit-order/:orderId" element={<CustomerFormPage orders={orders} updateOrder={updateOrder} />} />
          <Route path="/schedule/:orderId" element={<SchedulePage orders={orders} updateOrder={updateOrder} />} />
          <Route path="/menu/:orderId/:dayIndex/:slotType" element={<MenuSelectionPage orders={orders} updateOrder={updateOrder} dishes={dishes} />} />
          <Route path="/dish/:dishId" element={<DishDetailPage dishes={dishes} />} />
          <Route path="/share/:orderId" element={<SharePreviewPage orders={orders} dishes={dishes} />} />
          <Route path="/materials/:orderId" element={<MaterialListPage orders={orders} dishes={dishes} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
