
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Order, Dish } from '../types';

interface SharePreviewPageProps {
  orders: Order[];
  dishes: Dish[];
}

const SharePreviewPage: React.FC<SharePreviewPageProps> = ({ orders, dishes }) => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const decodedId = decodeURIComponent(orderId || '').trim();
  const order = orders.find(o => String(o.id).trim() === decodedId || String(o.orderNumber).trim() === decodedId);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-10 text-center bg-background-light">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">find_in_page</span>
        <h2 className="text-xl font-bold mb-2">订单已丢失或不存在</h2>
        <button
          onClick={() => navigate('/orders')}
          className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-bold"
        >
          返回订单列表
        </button>
      </div>
    );
  }

  const getDish = (id: string) => dishes.find(d => d.id === id);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
      <header className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => navigate(`/schedule/${order.id}`)}
          className="p-2 rounded-full hover:bg-slate-50 transition-colors"
          aria-label="返回日程管理"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg">宴席菜单确认单</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-6 pb-52">
        <div className="w-full bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="relative h-48 flex flex-col items-center justify-center p-8 text-white">
            <img src="https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/70"></div>
            <div className="relative z-10 text-center">
              <span className="material-symbols-outlined text-4xl mb-2 drop-shadow-lg">restaurant</span>
              <h1 className="text-xl font-black tracking-[0.2em] italic uppercase">萍姐家流动餐</h1>
              <div className="h-0.5 w-8 bg-white/40 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 mb-8 border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-black mb-4 flex items-center justify-between">
                <span>{order.customerName} 的{order.eventReason}</span>
                <span className="text-[10px] font-mono text-slate-400">{order.orderNumber}</span>
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-primary text-lg">phone_android</span>
                  <span className="font-bold">{order.customerPhone}</span>
                </p>
                <p className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-primary text-lg">pin_drop</span>
                  <span className="leading-tight pt-0.5">{order.address || '客户未提供详细地址'}</span>
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {order.plans.map((plan, dayIdx) => (
                <div key={dayIdx} className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                    <span className="text-[10px] font-black bg-primary text-white px-4 py-1 rounded-full tracking-widest">DAY {dayIdx + 1}</span>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                  </div>

                  {['lunch', 'dinner'].map(t => {
                    const slot = plan.slots[t as 'lunch' | 'dinner'];
                    if (!slot || slot.dishes.length === 0) return null;
                    return (
                      <div key={t} className="mb-8 last:mb-0">
                        <div className="flex items-center justify-between mb-4 px-1">
                          <p className="font-black text-sm flex items-center gap-2">
                            <span className={`material-symbols-outlined text-lg ${t === 'lunch' ? 'text-orange-500' : 'text-indigo-500'}`}>{t === 'lunch' ? 'light_mode' : 'dark_mode'}</span>
                            {t === 'lunch' ? '午宴' : '晚宴'}
                          </p>
                          <span className="text-xs font-bold text-slate-400">{slot.tableCount} 桌</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 border border-slate-50 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
                          {slot.dishes.map((d, i) => {
                            const dish = getDish(d.dishId);
                            return (
                              <div key={i} className="flex items-center justify-between py-3 px-2">
                                <div className="flex items-center gap-3">
                                  <img src={dish?.imageUrl} className="size-8 rounded-lg object-cover shadow-sm" />
                                  <span className="text-sm font-bold">{dish?.name}</span>
                                </div>
                                <span className="font-black text-primary text-xs">x {d.quantity}份/桌</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-16 text-center opacity-30">
              <span className="material-symbols-outlined text-5xl mb-2">qr_code_2</span>
              <p className="text-[10px] tracking-widest font-bold">扫码查看电子菜单</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 max-w-md mx-auto space-y-3 pb-10">
        <button
          onClick={() => navigate(`/materials/${order.id}`)}
          className="w-full bg-festive-orange text-white h-14 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-festive-orange/30 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          生成原材料清单 (供货商用)
        </button>
        {/*
        <div className="flex gap-4">
          <button className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-12 rounded-2xl font-bold active:bg-slate-50 transition-colors">
            保存图片
          </button>
          <button className="flex-1 bg-primary text-white h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
            确认并发送
          </button>
        </div>
        */}
      </footer>
    </div>
  );
};

export default SharePreviewPage;
