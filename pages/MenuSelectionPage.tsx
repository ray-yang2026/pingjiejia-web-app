
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Order, Dish } from '../types';

interface MenuSelectionPageProps {
  orders: Order[];
  updateOrder: (order: Order) => void;
  dishes: Dish[];
}

const MenuSelectionPage: React.FC<MenuSelectionPageProps> = ({ orders, updateOrder, dishes }) => {
  const navigate = useNavigate();
  const { orderId, dayIndex, slotType } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const decodedId = decodeURIComponent(orderId || '').trim();
  const order = orders.find(o => String(o.id).trim() === decodedId || String(o.orderNumber).trim() === decodedId);
  const currentSlot = order?.plans[parseInt(dayIndex || '0')]?.slots[slotType as 'lunch' | 'dinner'];

  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    if (currentSlot?.dishes) {
      const initialCart: Record<string, number> = {};
      currentSlot.dishes.forEach(d => {
        initialCart[d.dishId] = d.quantity;
      });
      setCart(initialCart);
    }
  }, [decodedId, currentSlot]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-10 text-center bg-background-light">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">no_meals</span>
        <h2 className="text-xl font-bold mb-2">点菜环境异常</h2>
        <button
          onClick={() => navigate('/orders')}
          className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-bold"
        >
          返回列表
        </button>
      </div>
    );
  }

  const categories = ['全部', '推荐菜', '肉菜', '素菜', '汤菜', '主食点心', '饮品'];
  const filteredDishes = dishes.filter(d => selectedCategory === '全部' || d.category === selectedCategory);

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const newQty = Math.max(0, (prev[id] || 0) + delta);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const handleFinish = () => {
    const updatedOrder = JSON.parse(JSON.stringify(order));
    const dayIdx = parseInt(dayIndex || '0');
    const type = slotType as 'lunch' | 'dinner';

    if (updatedOrder.plans[dayIdx]?.slots[type]) {
      updatedOrder.plans[dayIdx].slots[type].dishes = Object.entries(cart).map(([dishId, quantity]) => ({
        dishId,
        quantity
      }));
      updateOrder(updatedOrder);
    }
    navigate(`/schedule/${order.id}`);
  };

  const totalItems = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);
  const totalPrice = dishes.reduce((sum, dish) => sum + (cart[dish.id] || 0) * dish.price, 0);
  const cartItems = dishes.filter(d => cart[d.id] > 0);

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate(`/schedule/${order.id}`)}
            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined font-bold">arrow_back_ios_new</span>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold">
              D{parseInt(dayIndex || '0') + 1} - {slotType === 'lunch' ? '午宴' : '晚宴'}点菜
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{order.customerName}</p>
          </div>
          <div className="size-10"></div>
        </div>
      </header>

      <nav className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar shrink-0 bg-white/50 dark:bg-slate-900/50">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-xs font-bold border transition-all ${selectedCategory === cat
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <div className="grid grid-cols-2 gap-3">
          {filteredDishes.map(dish => (
            <div key={dish.id} className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col border-2 transition-all ${cart[dish.id] ? 'border-primary ring-4 ring-primary/5' : 'border-transparent'
              }`}>
              <div
                className="aspect-square bg-center bg-cover cursor-pointer relative"
                style={{ backgroundImage: `url(${dish.imageUrl})` }}
                onClick={() => navigate(`/dish/${dish.id}`)}
              >
                {cart[dish.id] && (
                  <div className="absolute top-2 right-2 bg-primary text-white size-6 rounded-full flex items-center justify-center shadow-lg font-bold text-xs">
                    {cart[dish.id]}
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="font-bold text-sm truncate">{dish.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-primary font-black text-sm">￥{dish.price}</p>

                  <div className="flex items-center gap-2">
                    {cart[dish.id] ? (
                      <>
                        <button
                          onClick={() => updateCart(dish.id, -1)}
                          className="bg-slate-100 dark:bg-slate-700 size-6 rounded-lg flex items-center justify-center active:scale-90"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="text-xs font-black">{cart[dish.id]}</span>
                        <button
                          onClick={() => updateCart(dish.id, 1)}
                          className="bg-primary text-white size-6 rounded-lg flex items-center justify-center active:scale-90 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => updateCart(dish.id, 1)}
                        className="bg-slate-50 dark:bg-slate-700 text-slate-400 size-7 rounded-lg flex items-center justify-center active:bg-primary active:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Items Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-t-[32px] p-6 max-h-[70vh] flex flex-col shadow-2xl">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6"></div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                已选清单
                <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {totalItems}件
                </span>
              </h3>
              <button
                onClick={() => setCart({})}
                className="text-slate-400 text-xs flex items-center gap-1 hover:text-red-500"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                清空
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pb-10 no-scrollbar">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <img src={item.imageUrl} className="size-16 rounded-2xl object-cover shadow-sm" />
                    <div className="flex-1">
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-xs text-primary font-black mt-1">￥{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl">
                      <button onClick={() => updateCart(item.id, -1)} className="size-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="font-black text-sm w-6 text-center">{cart[item.id]}</span>
                      <button onClick={() => updateCart(item.id, 1)} className="size-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 opacity-30">
                  <span className="material-symbols-outlined text-6xl mb-2">shopping_cart_off</span>
                  <p className="text-sm">清单空空如也</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Bar */}
      <div className="fixed bottom-6 left-4 right-4 z-[70] max-w-md mx-auto">
        <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-[24px] shadow-2xl p-2.5 flex items-center justify-between ring-1 ring-white/10">
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="flex items-center gap-4 pl-3 flex-1 active:opacity-70 transition-opacity"
          >
            <div className="relative">
              <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${totalItems > 0 ? 'bg-primary shadow-lg shadow-primary/40' : 'bg-slate-700'}`}>
                <span className="material-symbols-outlined text-2xl fill-1">shopping_basket</span>
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black size-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="text-left">
              <p className="font-black text-lg">￥{totalPrice.toFixed(1)}</p>
              <p className="text-slate-400 text-[10px] tracking-tight">点击查看已选清单</p>
            </div>
          </button>
          <button
            onClick={handleFinish}
            disabled={totalItems === 0}
            className={`flex items-center justify-center h-12 px-6 rounded-2xl font-black text-sm active:scale-95 transition-all ${totalItems === 0 ? 'bg-slate-700 text-slate-500' : 'bg-primary text-white shadow-lg shadow-primary/30'
              }`}
          >
            <span>确定菜单</span>
            <span className="material-symbols-outlined text-sm font-bold ml-1">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSelectionPage;
