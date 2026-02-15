
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Order } from '../types';

interface SchedulePageProps {
  orders: Order[];
  updateOrder: (order: Order) => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ orders, updateOrder }) => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // 更加鲁棒的 ID 匹配逻辑
  const decodedId = decodeURIComponent(orderId || '').trim();
  const order = orders.find(o => String(o.id).trim() === decodedId || String(o.orderNumber).trim() === decodedId);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-10 text-center bg-background-light">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error_outline</span>
        <h2 className="text-xl font-bold mb-2">未找到该订单</h2>
        <p className="text-slate-400 mb-6 text-sm">订单 ID 可能已失效或数据已重置</p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg"
        >
          返回订单列表
        </button>
      </div>
    );
  }

  const handleUpdateCount = (day: number, type: 'lunch' | 'dinner', value: number) => {
    const updatedOrder = JSON.parse(JSON.stringify(order));
    const plan = updatedOrder.plans[day];
    if (plan && plan.slots[type]) {
      // 确保不小于 0
      plan.slots[type].tableCount = Math.max(0, value);
      updateOrder(updatedOrder);
    }
  };

  const isSelected = (day: number, type: 'lunch' | 'dinner') => {
    const slot = order.plans[day]?.slots[type];
    return slot && slot.dishes && slot.dishes.length > 0;
  };

  const totalTables = order.plans.reduce((acc, plan) => {
    return acc + (plan.slots.lunch?.tableCount || 0) + (plan.slots.dinner?.tableCount || 0);
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <span onClick={() => navigate('/orders')} className="material-symbols-outlined text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 p-2 rounded-full">arrow_back_ios_new</span>
            <h1 className="text-lg font-bold">日程管理</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 px-3 py-1 rounded-full max-w-[140px]">
              <p className="text-primary text-xs font-bold truncate">{order.customerName}</p>
            </div>
            <button
              onClick={() => navigate(`/edit-order/${order.id}`)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-sm font-bold">edit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-52 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">排期与桌数设置</h2>
          <span className="text-xs text-slate-400">共 {order.plans.length} 天日程</span>
        </div>

        {order.plans.map((plan, dayIdx) => (
          <div key={dayIdx} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">D{dayIdx + 1}</div>
              <p className="font-bold text-lg">第 {dayIdx + 1} 天宴席</p>
            </div>

            <div className="space-y-6">
              {['lunch', 'dinner'].map((type) => {
                const t = type as 'lunch' | 'dinner';
                const slot = plan.slots[t];
                if (!slot) return null;

                return (
                  <div key={type} className={`rounded-2xl border transition-all ${isSelected(dayIdx, t) ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800' : 'bg-slate-50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-700'}`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-xl ${t === 'lunch' ? 'text-orange-500' : 'text-indigo-500'}`}>{t === 'lunch' ? 'light_mode' : 'dark_mode'}</span>
                          <span className="font-bold">{t === 'lunch' ? '午宴' : '晚宴'}</span>
                        </div>
                        {isSelected(dayIdx, t) && (
                          <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px] fill-1">check_circle</span>
                            <span className="text-[10px] font-bold">已点菜</span>
                          </div>
                        )}
                      </div>

                      {/* 直接填写桌数 */}
                      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 h-14 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <span className="pl-4 text-xs font-bold text-slate-400">预计桌数</span>
                        <div className="flex h-full items-center">
                          <button
                            onClick={() => handleUpdateCount(dayIdx, t, (slot.tableCount || 0) - 1)}
                            className="h-full w-12 flex items-center justify-center border-l border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-slate-50"
                          >
                            <span className="material-symbols-outlined text-lg font-bold">remove</span>
                          </button>
                          <input
                            type="number"
                            value={slot.tableCount || 0}
                            onChange={(e) => handleUpdateCount(dayIdx, t, parseInt(e.target.value) || 0)}
                            onFocus={(e) => e.target.select()}
                            className="w-16 text-center font-black text-xl border-none focus:ring-0 bg-transparent text-slate-900 dark:text-white"
                          />
                          <button
                            onClick={() => handleUpdateCount(dayIdx, t, (slot.tableCount || 0) + 1)}
                            className="h-full w-12 flex items-center justify-center border-l border-slate-100 dark:border-slate-700 text-primary hover:bg-slate-50"
                          >
                            <span className="material-symbols-outlined text-lg font-bold">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/menu/${order.id}/${dayIdx}/${type}`)}
                      className={`w-full py-3 font-bold text-sm flex items-center justify-center gap-1 transition-colors ${isSelected(dayIdx, t) ? 'bg-emerald-100/50 text-emerald-700' : 'bg-primary/10 text-primary'
                        }`}
                    >
                      <span className="material-symbols-outlined text-base">restaurant_menu</span>
                      {isSelected(dayIdx, t) ? '修改菜单' : '去点菜'}
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 pb-10 z-50 max-w-md mx-auto border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">整单概览</span>
            <span className="text-sm font-bold">合计 {totalTables} 桌</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100">
            <span className="material-symbols-outlined text-emerald-500 text-xs">check_circle</span>
            <span className="text-xs font-bold text-emerald-600">已自动保存</span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/share/${order.id}`)}
          className="w-full bg-primary text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">visibility</span>
          确认并预览分享单
        </button>
      </footer>
    </div>
  );
};

export default SchedulePage;
