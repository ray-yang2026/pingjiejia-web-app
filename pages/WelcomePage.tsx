
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full flex flex-col bg-cover bg-center" 
         style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop")' }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 flex-1 flex flex-col justify-between pt-16 pb-12 px-8">
        <div className="flex flex-col items-center">
          {/* Logo Circle Table Concept */}
          <div className="relative w-24 h-24 border-2 border-white/90 rounded-full flex items-center justify-center mb-10 shadow-2xl bg-white/10 backdrop-blur-md">
             {[...Array(10)].map((_, i) => (
               <div 
                 key={i} 
                 className="absolute w-2 h-2 bg-white rounded-sm shadow-sm"
                 style={{ 
                   transform: `rotate(${i * 36}deg) translateY(-60px)` 
                 }}
               />
             ))}
             <span className="material-symbols-outlined text-white/80 text-4xl">restaurant</span>
          </div>
          
          <div className="flex flex-col items-center">
            <h1 className="text-white text-4xl font-black tracking-tight mb-4 italic drop-shadow-lg">
              萍姐家流动餐
            </h1>
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="h-[1px] w-8 bg-gold-accent/60"></div>
              <p className="text-white font-medium tracking-[0.3em] text-sm opacity-90">始于 2008</p>
              <div className="h-[1px] w-8 bg-gold-accent/60"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-10 w-full max-w-xs text-center">
            <p className="text-white text-2xl font-black tracking-[0.2em] mb-10 border-y border-white/20 py-2 inline-block">
              好吃 · 实惠 · 省心
            </p>
            
            <div className="flex justify-around mb-12">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center border border-gold-accent/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-gold-accent text-xl">verified</span>
                </div>
                <span className="text-white text-[10px] font-bold tracking-wider">品质保证</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center border border-gold-accent/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-gold-accent text-xl">payments</span>
                </div>
                <span className="text-white text-[10px] font-bold tracking-wider">价格亲民</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center border border-gold-accent/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-gold-accent text-xl">health_and_safety</span>
                </div>
                <span className="text-white text-[10px] font-bold tracking-wider">卫生安全</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/orders')}
              className="flex w-full cursor-pointer items-center justify-center rounded-full h-14 bg-festive-orange text-white text-lg font-black tracking-[0.2em] shadow-xl active:scale-95 transition-all"
            >
              开始订菜
            </button>
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <a 
              href="tel:13988211595" 
              className="flex items-center justify-center gap-3 w-full max-w-xs py-3 rounded-full bg-black/40 border border-white/20 backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-gold-accent">call</span>
              <span className="text-white font-bold tracking-widest text-sm">订餐电话：13988211595</span>
            </a>
            <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase mt-2">
              PREMIUM FESTIVE CATERING SERVICE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
