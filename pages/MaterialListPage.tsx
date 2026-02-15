
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Order, Dish } from '../types';

interface MaterialListPageProps {
  orders: Order[];
  dishes: Dish[];
}

type MaterialCategory = '肉类' | '菜类' | '佐料类' | '其他';

interface IngredientSummary {
  name: string;
  amount: number;
  unit: string;
  category: MaterialCategory;
}

const CATEGORY_ORDER: MaterialCategory[] = ['肉类', '菜类', '佐料类', '其他'];

const MaterialListPage: React.FC<MaterialListPageProps> = ({ orders, dishes }) => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const decodedId = decodeURIComponent(orderId || '').trim();
  const order = orders.find(o => String(o.id).trim() === decodedId || String(o.orderNumber).trim() === decodedId);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-10 text-center bg-white">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">inventory</span>
        <h2 className="text-xl font-bold">找不到订单数据</h2>
        <button onClick={() => navigate('/orders')} className="mt-6 bg-primary text-white px-6 py-2 rounded-xl">返回列表</button>
      </div>
    );
  }

  const getSlotIngredients = (slotDishes: Array<{ dishId: string, quantity: number }>, tableCount: number) => {
    const map: Record<string, IngredientSummary> = {};
    slotDishes.forEach(d => {
      const dish = dishes.find(md => md.id === d.dishId);
      if (!dish || !dish.ingredients) return;
      dish.ingredients.forEach(ing => {
        const numericPart = parseFloat(ing.amount) || 0;
        const unitPart = ing.amount.replace(/[0-9.]/g, '') || '份';
        const total = numericPart * d.quantity * tableCount;

        if (!map[ing.name]) {
          map[ing.name] = { name: ing.name, amount: 0, unit: unitPart, category: ing.category };
        }
        map[ing.name].amount += total;
      });
    });
    return Object.values(map);
  };

  const renderIngredientTable = (ingredients: IngredientSummary[], title: string, subtitle?: string) => {
    if (ingredients.length === 0) return null;

    return (
      <div className="mb-10 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{subtitle}</p>}
          </div>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">清单</span>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          {CATEGORY_ORDER.map(cat => {
            const catItems = ingredients.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat}>
                <div className="bg-slate-100/50 dark:bg-slate-900/30 px-5 py-1.5 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${cat === '肉类' ? 'bg-red-500' :
                      cat === '菜类' ? 'bg-green-500' :
                        cat === '佐料类' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}></div>
                  <span className="text-[10px] font-black text-slate-400 tracking-widest">{cat}</span>
                </div>
                {catItems.map(item => (
                  <div key={item.name} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-primary font-black text-base">{item.amount.toFixed(1)}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center p-4 border-b border-slate-200 bg-white dark:bg-slate-900 sticky top-0 z-20 shadow-sm">
        <button onClick={() => navigate(`/share/${order.id}`)} className="p-2 rounded-full hover:bg-slate-50">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">物料精细清单</h1>
        <div className="w-10"></div>
      </header>

      <main className="p-4 pb-40">
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">list_alt</span>
            </div>
            <div>
              <h2 className="text-xl font-black">{order.customerName} 的宴席</h2>
              <p className="text-xs text-slate-400 font-bold">{order.eventReason} · {order.daysCount} 天日程</p>
            </div>
          </div>
          <div className="h-px bg-slate-50 dark:bg-slate-700 my-4"></div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
            <span className="text-amber-500">提示：</span> 清单已自动根据每餐桌数及菜品配方进行精确换算。建议在实际采购时，易损耗食材（如绿叶菜）额外预备 10%。
          </p>
        </div>

        {order.plans.map((plan, dayIdx) => {
          const dayIngredients: Record<string, IngredientSummary> = {};

          const processSlot = (slot?: any) => {
            if (!slot || slot.tableCount === 0 || slot.dishes.length === 0) return [];
            const ings = getSlotIngredients(slot.dishes, slot.tableCount);
            // Add to daily aggregate
            ings.forEach(i => {
              if (!dayIngredients[i.name]) {
                dayIngredients[i.name] = { ...i, amount: 0 };
              }
              dayIngredients[i.name].amount += i.amount;
            });
            return ings;
          };

          const lunchIngs = processSlot(plan.slots.lunch);
          const dinnerIngs = processSlot(plan.slots.dinner);
          const dailyTotalIngs = Object.values(dayIngredients);

          return (
            <div key={dayIdx} className="mb-12">
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs font-black text-slate-400 tracking-[0.3em] uppercase">第 {dayIdx + 1} 天 明细</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
              </div>

              {/* Meal Breakdowns */}
              {lunchIngs.length > 0 && renderIngredientTable(lunchIngs, `D${dayIdx + 1} 午宴清单`, `${plan.slots.lunch?.tableCount} 桌`)}
              {dinnerIngs.length > 0 && renderIngredientTable(dinnerIngs, `D${dayIdx + 1} 晚宴清单`, `${plan.slots.dinner?.tableCount} 桌`)}

              {/* Daily Summary */}
              {dailyTotalIngs.length > 0 && (
                <div className="relative mt-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-festive-orange/20 blur opacity-20 rounded-3xl"></div>
                  {renderIngredientTable(dailyTotalIngs, `D${dayIdx + 1} 全天合计`, "今日采购总量汇总")}
                </div>
              )}
            </div>
          );
        })}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-30 max-w-md mx-auto space-y-3 pb-10">
        <div className="flex gap-4">
          <button className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-14 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-xl">print</span>
            打印清单
          </button>
          <button className="flex-2 bg-primary text-white h-14 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-xl">send_to_mobile</span>
            一键发给供应商
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MaterialListPage;
