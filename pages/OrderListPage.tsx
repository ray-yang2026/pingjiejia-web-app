
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types';

interface OrderListPageProps {
  orders: Order[];
  updateOrder: (order: Order) => void;
}

const OrderListPage: React.FC<OrderListPageProps> = ({ orders = [], updateOrder }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = Array.isArray(orders) ? orders.filter(o => {
    const matchesFilter = filter === '全部' || o.status === filter;
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) : [];

  // Group by Date
  const groupedOrders: Record<string, Order[]> = {};
  filteredOrders.forEach(order => {
    const dateKey = order.startDate || '未设置日期';
    if (!groupedOrders[dateKey]) groupedOrders[dateKey] = [];
    groupedOrders[dateKey].push(order);
  });

  // Sort dates descending
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => b.localeCompare(a));

  const toggleStatus = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = order.status === OrderStatus.TO_BE_EXECUTED 
      ? OrderStatus.COMPLETED 
      : OrderStatus.TO_BE_EXECUTED;
    
    updateOrder({ ...order, status: newStatus });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <span onClick={() => navigate('/')} className="material-symbols-outlined cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">arrow_back_ios_new</span>
          <h1 className="text-xl font-bold">历史订单</h1>
        </div>
        <div className="size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full">
           <span className="material-symbols-outlined text-slate-500">calendar_month</span>
        </div>
      </header>

      <main className="flex-1 pb-32">
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center rounded-2xl h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 shadow-sm">
            <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold" 
              placeholder="搜索客户名称..." 
            />
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {['全部', OrderStatus.TO_BE_EXECUTED, OrderStatus.COMPLETED].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)} 
                className={`px-5 py-2 rounded-full text-xs font-bold border transition-all shrink-0 ${
                  filter === f 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 space-y-8">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => (
              <div key={date} className="px-4">
                {/* Date Group Header */}
                <div className="sticky top-[73px] z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm py-2 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary"></div>
                    <h2 className="font-black text-slate-900 dark:text-white text-sm">{date}</h2>
                  </div>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold text-slate-500">
                    {groupedOrders[date].length} 个订单
                  </span>
                </div>

                <div className="space-y-4">
                  {groupedOrders[date].map(order => (
                    <div 
                      key={order.id} 
                      className="bg-white dark:bg-slate-800 rounded-[24px] p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Status Indicator Bar */}
                      <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${
                        order.status === OrderStatus.TO_BE_EXECUTED ? 'bg-primary' : 'bg-emerald-500'
                      }`}></div>

                      <div className="flex justify-between items-start mb-3 pl-2">
                        <div>
                          <h3 className="text-lg font-black">{order.customerName}</h3>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{order.orderNumber}</p>
                        </div>
                        
                        {/* Status Switch Toggle */}
                        <button 
                          onClick={(e) => toggleStatus(order, e)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all active:scale-95 ${
                            order.status === OrderStatus.TO_BE_EXECUTED 
                              ? 'bg-amber-50 text-amber-600 border-amber-200' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {order.status === OrderStatus.TO_BE_EXECUTED ? 'pending_actions' : 'task_alt'}
                          </span>
                          <span className="text-[10px] font-black">{order.status}</span>
                        </button>
                      </div>
                      
                      <div className="pl-2 space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                          <span className="material-symbols-outlined text-sm">celebration</span>
                          {order.eventReason} · {order.daysCount}天宴席
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                          <span className="material-symbols-outlined text-sm">pin_drop</span>
                          {order.address || '未提供详细地址'}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/schedule/${order.id}`)} 
                          className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                          管理排期
                        </button>
                        <button 
                          onClick={() => navigate(`/share/${order.id}`)} 
                          className="size-11 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl flex items-center justify-center active:scale-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-slate-400">share</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
              <span className="material-symbols-outlined text-7xl">receipt_long</span>
              <p className="font-bold mt-4">暂无相关订单</p>
            </div>
          )}
        </div>
      </main>

      <button 
        onClick={() => navigate('/new-order')} 
        className="fixed bottom-28 right-6 size-16 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-all ring-4 ring-white/10"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 pb-10 pt-3 z-40 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-bold">首页</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined fill-1">receipt_long</span>
            <span className="text-[10px] font-bold">订单</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer" onClick={() => navigate('/recipes')}>
            <span className="material-symbols-outlined">restaurant</span>
            <span className="text-[10px] font-bold">菜谱</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-bold">我的</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default OrderListPage;
