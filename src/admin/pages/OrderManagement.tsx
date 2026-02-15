import React, { useState, useEffect } from 'react';
import * as api from '../../../apiService';
import type { Order, OrderCreate } from '../../../types';

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [reasons, setReasons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Partial<OrderCreate> | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([loadOrders(), loadReasons()]);
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

    const loadReasons = async () => {
        try {
            const data = await api.fetchConfig('event_reasons');
            setReasons(data.values || []);
        } catch {
            // 忽略 — 事由配置没有也不影响手动输入
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

    const handleStatusToggle = async (order: Order) => {
        const newStatus = order.status === '待执行' ? '已完成' : '待执行';
        try {
            await api.updateOrderStatus(order.id, newStatus);
            loadOrders();
        } catch (error) {
            alert('状态更新失败');
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setCurrentOrder({
            customerName: '',
            customerPhone: '',
            eventReason: '',
            address: '',
            daysCount: 1,
            startDate: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (order: Order) => {
        setEditingId(order.id);
        setCurrentOrder({
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            eventReason: order.eventReason,
            address: order.address,
            daysCount: order.daysCount,
            startDate: order.startDate,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentOrder) return;

        try {
            if (editingId) {
                // 编辑模式 — 获取原始订单数据再合并
                const original = orders.find(o => o.id === editingId);
                if (original) {
                    await api.updateOrderApi(editingId, { ...original, ...currentOrder });
                }
            } else {
                await api.createOrder(currentOrder as OrderCreate);
            }
            setIsModalOpen(false);
            loadOrders();
        } catch (err) {
            alert('保存失败');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case '待执行': return 'bg-orange-100 text-orange-600 border-orange-200';
            case '已完成': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">订单与客户管理</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    新增订单
                </button>
            </div>

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
                            <React.Fragment key={order.id}>
                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
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
                                        <button
                                            onClick={() => handleStatusToggle(order)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border cursor-pointer hover:opacity-80 transition-opacity ${getStatusStyle(order.status)}`}
                                            title="点击切换状态"
                                        >
                                            {order.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                title="查看详情"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    {expandedId === order.id ? 'expand_less' : 'expand_more'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => openEditModal(order)}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                title="编辑"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                title="删除"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* 展开的排期详情 */}
                                {expandedId === order.id && (
                                    <tr>
                                        <td colSpan={6} className="bg-slate-50/50 dark:bg-slate-700/20 px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                                    排期预览
                                                    {order.address && (
                                                        <span className="ml-4 normal-case text-slate-500">
                                                            <span className="material-symbols-outlined text-sm align-text-bottom">pin_drop</span> {order.address}
                                                        </span>
                                                    )}
                                                </div>
                                                {order.plans && order.plans.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {order.plans.map((plan, i) => (
                                                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                                                <div className="text-sm font-black mb-2">{plan.date}</div>
                                                                <div className="space-y-1 text-xs">
                                                                    <div className="flex justify-between text-slate-500">
                                                                        <span>午宴</span>
                                                                        <span className="font-bold">
                                                                            {plan.slots.lunch?.tableCount || 0} 桌 · {plan.slots.lunch?.dishes?.length || 0} 道菜
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between text-slate-500">
                                                                        <span>晚宴</span>
                                                                        <span className="font-bold">
                                                                            {plan.slots.dinner?.tableCount || 0} 桌 · {plan.slots.dinner?.dishes?.length || 0} 道菜
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic">尚未配置排期</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Create/Edit Modal */}
            {isModalOpen && currentOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black">{editingId ? '编辑订单' : '新增订单'}</h3>
                                <p className="text-xs text-slate-400 font-bold mt-1">填写客户信息和宴席安排</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-slate-800 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">客户姓名</label>
                                    <input
                                        value={currentOrder.customerName || ''}
                                        onChange={e => setCurrentOrder({ ...currentOrder, customerName: e.target.value })}
                                        required
                                        placeholder="姓名"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">联系电话</label>
                                    <input
                                        value={currentOrder.customerPhone || ''}
                                        onChange={e => setCurrentOrder({ ...currentOrder, customerPhone: e.target.value })}
                                        required
                                        placeholder="手机号码"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">宴席事由</label>
                                {reasons.length > 0 ? (
                                    <select
                                        value={currentOrder.eventReason || ''}
                                        onChange={e => setCurrentOrder({ ...currentOrder, eventReason: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    >
                                        <option value="">请选择事由</option>
                                        {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        value={currentOrder.eventReason || ''}
                                        onChange={e => setCurrentOrder({ ...currentOrder, eventReason: e.target.value })}
                                        required
                                        placeholder="如：寿宴、满月"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">地址</label>
                                <input
                                    value={currentOrder.address || ''}
                                    onChange={e => setCurrentOrder({ ...currentOrder, address: e.target.value })}
                                    placeholder="宴席举办地址"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">开始日期</label>
                                    <input
                                        type="date"
                                        value={currentOrder.startDate || ''}
                                        onChange={e => setCurrentOrder({ ...currentOrder, startDate: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">宴席天数</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={currentOrder.daysCount || 1}
                                        onChange={e => setCurrentOrder({ ...currentOrder, daysCount: parseInt(e.target.value) || 1 })}
                                        required
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black mt-4 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
                            >
                                {editingId ? '保 存 修 改' : '创 建 订 单'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
