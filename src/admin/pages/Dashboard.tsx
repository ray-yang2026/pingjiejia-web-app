import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchStats } from '../../../apiService';
import type { DashboardStats, Order } from '../../../types';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        fetchStats().then(setStats).catch(console.error);
    }, []);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">仪表盘</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="总订单" value={String(stats?.totalOrders ?? '—')} icon="receipt_long" color="bg-blue-500" />
                <StatCard title="待执行" value={String(stats?.activeOrders ?? '—')} icon="pending_actions" color="bg-amber-500" />
                <StatCard title="菜品总数" value={String(stats?.totalDishes ?? '—')} icon="restaurant" color="bg-orange-500" />
                <StatCard title="供应商" value={String(stats?.totalSuppliers ?? '—')} icon="local_shipping" color="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-black text-sm uppercase tracking-wider text-slate-500">近期订单</h3>
                        <Link to="/orders" className="text-primary text-xs font-bold hover:underline">查看全部 →</Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-700">
                        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order: Order) => (
                                <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{order.customerName}</div>
                                            <div className="text-xs text-slate-400">{order.eventReason} · {order.startDate} · {order.daysCount}天</div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black ${order.status === '待执行' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-slate-400 text-sm">暂无订单数据</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-wider text-slate-500">快捷操作</h3>
                    <div className="space-y-3">
                        <QuickAction to="/orders" icon="add_circle" label="新增订单" desc="创建一个新的宴席订单" color="text-blue-500" />
                        <QuickAction to="/dishes" icon="restaurant_menu" label="管理菜品" desc="添加或编辑菜品信息" color="text-orange-500" />
                        <QuickAction to="/ingredients" icon="egg_alt" label="原材料库" desc="维护原材料层级分类" color="text-emerald-500" />
                        <QuickAction to="/suppliers" icon="local_shipping" label="供应商管理" desc="管理供应商联系方式" color="text-purple-500" />
                        <QuickAction to="/config" icon="settings" label="系统配置" desc="菜品分类、事由等选项" color="text-slate-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color}`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    </div>
);

const QuickAction: React.FC<{ to: string; icon: string; label: string; desc: string; color: string }> = ({ to, icon, label, desc, color }) => (
    <Link to={to} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
        <span className={`material-symbols-outlined ${color}`}>{icon}</span>
        <div className="flex-1">
            <div className="font-bold text-sm group-hover:text-primary transition-colors">{label}</div>
            <div className="text-xs text-slate-400">{desc}</div>
        </div>
        <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
    </Link>
);

export default Dashboard;
