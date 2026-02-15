import React, { useState, useEffect } from 'react';
import * as api from '../../../apiService';
import type { IngredientLibraryItem } from '../../../types';

const IngredientManagement: React.FC = () => {
    const [ingredients, setIngredients] = useState<IngredientLibraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItemName, setNewItemName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState<string>('');

    useEffect(() => {
        loadIngredients();
    }, []);

    const loadIngredients = async () => {
        try {
            const data = await api.fetchIngredientLibrary();
            setIngredients(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newItemName.trim()) return;

        const isLevel1 = !selectedParentId;
        const newItem: IngredientLibraryItem = {
            id: 'ing-' + Date.now(),
            name: newItemName.trim(),
            level: isLevel1 ? 1 : 2,
            parentId: selectedParentId || undefined
        };

        try {
            await api.saveIngredientLibrary(newItem);
            setNewItemName('');
            loadIngredients();
        } catch (error) {
            alert('添加失败');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除吗？这将影响关联此原料的菜品显示。')) return;
        try {
            await api.deleteIngredientLibrary(id);
            loadIngredients();
        } catch (error) {
            alert('删除失败');
        }
    };

    const level1Items = ingredients.filter(i => i.level === 1);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">原材料库管理</h2>

            {/* Quick Add Form */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">所属大类 (不选则为新增大类)</label>
                    <select
                        value={selectedParentId}
                        onChange={e => setSelectedParentId(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    >
                        <option value="">—— 作为大类 (一级) ——</option>
                        {level1Items.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">原材料名称</label>
                    <input
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                        placeholder="如：牛肉、菜心、生抽"
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-white h-10 px-8 rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    添 加
                </button>
            </div>

            {/* Hierarchy View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {level1Items.map(parent => (
                    <div key={parent.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-600 flex justify-between items-center font-black">
                            <span>{parent.name}</span>
                            <button onClick={() => handleDelete(parent.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                        <div className="p-4 flex flex-wrap gap-2">
                            {ingredients.filter(i => i.parentId === parent.id).map(child => (
                                <div key={child.id} className="group relative bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 text-sm font-bold flex items-center gap-2">
                                    {child.name}
                                    <button onClick={() => handleDelete(child.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </div>
                            ))}
                            {ingredients.filter(i => i.parentId === parent.id).length === 0 && (
                                <p className="text-xs text-slate-400 italic">暂无子项</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IngredientManagement;
