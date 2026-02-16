
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types';

interface OrderListPageProps {
  orders: Order[];
  updateOrder: (order: Order) => void;
  deleteOrder?: (orderId: string) => void;
}

const OrderListPage: React.FC<OrderListPageProps> = ({ orders = [], updateOrder, deleteOrder }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Group orders by date
  const groupedOrders = orders
    .filter(o => filterStatus === 'ALL' || o.status === filterStatus)
    .filter(o => o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.address.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime())
    .reduce((acc, order) => {
      const date = order.startDate || '未设置日期';
      if (!acc[date]) acc[date] = [];
      acc[date].push(order);
      return acc;
    }, {} as Record<string, Order[]>);

  const toggleStatus = (order: Order) => {
    const newStatus = order.status === OrderStatus.TO_BE_EXECUTED ? OrderStatus.COMPLETED : OrderStatus.TO_BE_EXECUTED;
    updateOrder({ ...order, status: newStatus });
  };

  const handleDelete = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个订单吗？此操作无法撤销。')) {
      deleteOrder && deleteOrder(orderId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">我的订单</h1>
          <button
            onClick={() => navigate('/new-order')}
            className="bg-primary text-white size-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined font-bold">add</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="搜索客户姓名或地址..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-slate-100 dark:bg-slate-800 rounded-xl pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['ALL', OrderStatus.TO_BE_EXECUTED, OrderStatus.COMPLETED] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === status
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {status === 'ALL' ? '全部' : status === OrderStatus.TO_BE_EXECUTED ? '待执行' : '历史订单'}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 pb-32">
        {Object.entries(groupedOrders).length > 0 ? (
          Object.entries(groupedOrders).map(([date, dayOrders]) => (
            <div key={date} className="mb-6">
              <div className="sticky top-[148px] z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-sm font-bold text-slate-500">{date}</span>
                <span className="text-xs text-slate-300">({dayOrders.length}单)</span>
              </div>
              <div className="px-4 space-y-4">
                {dayOrders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/customer/${order.id}`)}
                    className="bg-white dark:bg-slate-800 rounded-[24px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.98] transition-all relative overflow-hidden"
                  >
                    {/* Status Badge */}
                    <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black tracking-wider uppercase ${order.status === OrderStatus.TO_BE_EXECUTED
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-slate-100 text-slate-400'
                      }`}>
                      {order.status === OrderStatus.TO_BE_EXECUTED ? '待执行' : '已完成'}
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          {order.customerName}
                          <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                            {order.eventReason}
                          </span>
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {order.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/schedule/${order.id}`); }}
                        className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                      >
                        管理排期
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/share/${order.id}`); }}
                        className="size-11 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-xl flex items-center justify-center active:scale-90 transition-all text-slate-600 dark:text-slate-300"
                      >
                        <span className="material-symbols-outlined">share</span>
                      </button>
                      {/* Delete Button */}
                      {deleteOrder && (
                        <button
                          onClick={(e) => handleDelete(order.id, e)}
                          className="size-11 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center justify-center active:scale-90 transition-all text-red-500"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      )}
                    </div>

                    {/* Status Toggle (Optional, maybe move to detail) */}
                    {/*
                    <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStatus(order); }}
                        className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {order.status === OrderStatus.TO_BE_EXECUTED ? 'check_circle' : 'history'}
                        </span>
                        标记为{order.status === OrderStatus.TO_BE_EXECUTED ? '已完成' : '待执行'}
                      </button>
                    </div>
                    */}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inbox</span>
            <p className="font-bold text-slate-400">暂无相关订单</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-10 pt-3 z-40 max-w-md mx-auto shadow-2xl">
        <div className="flex justify-around items-center px-4">
          <div className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">首页</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer">
            <span className="material-symbols-outlined fill-1">receipt_long</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">订单</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer" onClick={() => navigate('/recipes')}>
            <span className="material-symbols-outlined">restaurant</span>
            <span className="text-[10px] font-bold">菜谱</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default OrderListPage;
