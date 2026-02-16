
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dish } from '../types';
import { DISH_CATEGORIES } from '../constants';

interface RecipeListPageProps {
  dishes: Dish[];
}

const RecipeListPage: React.FC<RecipeListPageProps> = ({ dishes }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('全部');
  const categories = DISH_CATEGORIES;

  const filtered = dishes.filter(d => category === '全部' || d.category === category);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <span onClick={() => navigate('/orders')} className="material-symbols-outlined cursor-pointer hover:bg-slate-100 p-2 rounded-full">arrow_back_ios_new</span>
          <h1 className="text-xl font-bold">精品菜谱</h1>
        </div>
        <span className="material-symbols-outlined text-slate-400">search</span>
      </header>

      <nav className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-[72px] z-20">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${category === c
              ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
          >
            {c}
          </button>
        ))}
      </nav>

      <main className="p-4 grid grid-cols-2 gap-4 pb-32 overflow-y-auto">
        {filtered.map(dish => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dish/${dish.id}`)}
            className="group bg-white dark:bg-slate-800 rounded-[24px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col active:scale-95 transition-all"
          >
            <div className="aspect-square bg-cover bg-center overflow-hidden relative">
              <img
                src={dish.imageUrl}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={dish.name}
              />
              <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold">
                {dish.category}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm truncate mb-1">{dish.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-primary font-black text-sm">￥{dish.price.toFixed(1)}</p>
                <div className="size-6 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 py-20 flex flex-col items-center justify-center opacity-30">
            <span className="material-symbols-outlined text-6xl">restaurant_menu</span>
            <p className="text-sm font-bold mt-2">暂无该分类菜品</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-10 pt-3 z-40 max-w-md mx-auto shadow-2xl">
        <div className="flex justify-around items-center px-4">
          <div className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">首页</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-slate-400 cursor-pointer" onClick={() => navigate('/orders')}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">订单</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-primary cursor-pointer">
            <span className="material-symbols-outlined fill-1">restaurant</span>
            <span className="text-[10px] font-bold uppercase tracking-tight">菜谱</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default RecipeListPage;
