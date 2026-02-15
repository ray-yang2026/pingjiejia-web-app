import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">仪表盘</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="总订单数" value="12" icon="receipt_long" color="bg-blue-500" />
                <StatCard title="菜品总数" value="48" icon="restaurant" color="bg-orange-500" />
                <StatCard title="供应商" value="5" icon="local_shipping" color="bg-emerald-500" />
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color} shadow-lg shadow-${color}/30`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    </div>
);

export default Dashboard;
