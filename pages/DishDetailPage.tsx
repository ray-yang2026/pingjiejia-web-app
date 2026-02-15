
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dish } from '../types';

interface DishDetailPageProps {
  dishes: Dish[];
}

const DishDetailPage: React.FC<DishDetailPageProps> = ({ dishes }) => {
  const navigate = useNavigate();
  const { dishId } = useParams();
  const dish = dishes.find(d => d.id === dishId);

  if (!dish) return (
    <div className="flex flex-col items-center justify-center h-screen p-10 text-center bg-background-light">
      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">no_meals</span>
      <h2 className="text-xl font-bold mb-2">菜品不存在</h2>
      <button onClick={() => navigate(-1)} className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-bold">返回</button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Top Header Buttons */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <button
          onClick={() => navigate(-1)}
          className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2">
          <button className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div
        className="w-full h-[400px] bg-center bg-cover"
        style={{ backgroundImage: `url(${dish.imageUrl})` }}
      />

      {/* Content Container */}
      <div className="relative -mt-12 rounded-t-[40px] bg-background-light dark:bg-background-dark px-6 pt-10 shadow-2xl flex-1 pb-32">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">招牌推荐</span>
          <div className="flex items-center gap-1 text-amber-500">
            <span className="material-symbols-outlined fill-1 !text-lg">star</span>
            <span className="text-xs font-bold">4.9 (200+ 好评)</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">{dish.name}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg border-b border-slate-100 dark:border-slate-800 pb-8 mb-8 leading-relaxed">
          {dish.description}
        </p>

        <section>
          <h3 className="text-xl font-bold mb-5">主要原料 (每桌用量)</h3>
          <div className="grid grid-cols-2 gap-4">
            {dish.ingredients?.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-700">
                <div className="size-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{ing.amount} {ing.name}</p>
                  <p className="text-[10px] text-slate-400">{ing.detail || '精选主料'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center pb-12">
          <p className="text-slate-400 text-xs">向下滑动查看更多做法详情</p>
          <span className="material-symbols-outlined text-slate-300">expand_more</span>
        </div>
      </div>

      {/* Floating Price Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-30 max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-full flex items-center justify-between h-16 bg-primary text-white rounded-2xl font-bold px-6 shadow-xl shadow-primary/30 active:scale-95 transition-all"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase opacity-70">每桌价格</span>
            <span className="text-xl">￥{dish.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>加入订单</span>
            <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DishDetailPage;
