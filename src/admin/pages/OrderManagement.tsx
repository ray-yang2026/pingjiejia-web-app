import React, { useState, useEffect } from 'react';
import * as api from '../../../apiService';

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await api.fetchOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这个订单吗？')) return;
        try {
            await api.deleteOrderApi(id);
            loadOrders();
        } catch (error) {
            alert('删除失败');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case '待执行': return 'bg-orange-100 text-orange-600';
            case '执行中': return 'bg-blue-100 text-blue-600';
            case '已完成': return 'bg-emerald-100 text-emerald-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">订单与客户管理</h2>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">订单号</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">客户</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">事由</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">日期/天数</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">状态</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">加载中...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">暂无订单数据</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-slate-400 uppercase">{order.orderNumber}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{order.customerName}</span>
                                        <span className="text-xs text-slate-400">{order.customerPhone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">{order.eventReason}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex flex-col">
                                        <span>{order.startDate}</span>
                                        <span className="text-xs text-primary font-bold">{order.daysCount} 天</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(order.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
