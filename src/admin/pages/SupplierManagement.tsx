import React, { useState, useEffect } from 'react';
import * as api from '../../../apiService';

const SupplierManagement: React.FC = () => {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState<any>(null);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const data = await api.fetchSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这个供应商吗？')) return;
        try {
            await api.deleteSupplier(id);
            loadSuppliers();
        } catch (error) {
            alert('删除失败');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">供应商管理</h2>
                <button
                    onClick={() => { setCurrentSupplier(null); setIsModalOpen(true); }}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    新增供应商
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">类别</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">名称</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">联系人</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">电话</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">备注</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">加载中...</td></tr>
                        ) : suppliers.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">暂无供应商数据</td></tr>
                        ) : suppliers.map(sup => (
                            <tr key={sup.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-600 rounded-md text-xs font-bold">{sup.category}</span>
                                </td>
                                <td className="px-6 py-4 font-bold">{sup.name}</td>
                                <td className="px-6 py-4 text-slate-500">{sup.contactName || '-'}</td>
                                <td className="px-6 py-4 font-mono text-sm text-primary">{sup.phone}</td>
                                <td className="px-6 py-4 text-slate-400 text-sm">{sup.note || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => { setCurrentSupplier(sup); setIsModalOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(sup.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Supplier Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg relative z-10 overflow-hidden shadow-2xl scale-in-center animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 flex justify-between items-center">
                            <h3 className="text-xl font-bold">{currentSupplier ? '编辑供应商' : '新增供应商'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 hover:text-slate-800 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form className="p-8 space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data = {
                                id: currentSupplier?.id || '',
                                name: formData.get('name') as string,
                                category: formData.get('category') as string,
                                contactName: formData.get('contactName') as string,
                                phone: formData.get('phone') as string,
                                note: formData.get('note') as string,
                            };
                            try {
                                if (currentSupplier) {
                                    await api.updateSupplier(currentSupplier.id, data);
                                } else {
                                    await api.createSupplier(data);
                                }
                                setIsModalOpen(false);
                                loadSuppliers();
                            } catch (err) {
                                alert('保存失败');
                            }
                        }}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">供应商名称</label>
                                <input name="name" defaultValue={currentSupplier?.name} required className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="公司名或个人姓名" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">类别</label>
                                    <input name="category" defaultValue={currentSupplier?.category} required className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="如：肉类" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">联系人</label>
                                    <input name="contactName" defaultValue={currentSupplier?.contactName} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="姓名" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">联系电话</label>
                                <input name="phone" defaultValue={currentSupplier?.phone} required className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="手机或座机" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">备注</label>
                                <textarea name="note" defaultValue={currentSupplier?.note} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold resize-none" rows={2} placeholder="供货规律、质量等说明..." />
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black mt-4 shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
                                保 存 供 应 商
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierManagement;
