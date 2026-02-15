import React, { useState, useEffect } from 'react';
import * as api from '../../../apiService';

const DishManagement: React.FC = () => {
    const [dishes, setDishes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDish, setCurrentDish] = useState<any>(null);

    useEffect(() => {
        loadDishes();
    }, []);

    const loadDishes = async () => {
        try {
            const data = await api.fetchDishes();
            setDishes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除这个菜品吗？')) return;
        try {
            await api.deleteDish(id);
            loadDishes();
        } catch (error) {
            alert('删除失败');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">菜品管理</h2>
                <button
                    onClick={() => { setCurrentDish(null); setIsModalOpen(true); }}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    新增菜品
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12 text-slate-400">加载中...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dishes.map(dish => (
                        <div key={dish.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
                                    {dish.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-black">{dish.name}</h3>
                                    <span className="text-primary font-black">¥{dish.price}</span>
                                </div>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{dish.description}</p>

                                <div className="flex items-center gap-2 border-t border-slate-50 dark:border-slate-700 pt-4 mt-2">
                                    <button
                                        onClick={() => { setCurrentDish(dish); setIsModalOpen(true); }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        编辑
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dish.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dish Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/50">
                            <div>
                                <h3 className="text-xl font-black">{currentDish ? '编辑菜品' : '新增菜品'}</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">请填写以下菜品详细信息</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form className="p-8 space-y-6 max-h-[70vh] overflow-y-auto" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data = {
                                id: currentDish?.id || '',
                                name: formData.get('name') as string,
                                description: formData.get('description') as string,
                                price: parseFloat(formData.get('price') as string),
                                category: formData.get('category') as string,
                                imageUrl: formData.get('imageUrl') as string,
                                ingredients: currentDish?.ingredients || []
                            };

                            try {
                                if (currentDish) {
                                    await api.updateDish(currentDish.id, data);
                                } else {
                                    await api.createDish(data);
                                }
                                setIsModalOpen(false);
                                loadDishes();
                            } catch (err) {
                                alert('保存失败');
                            }
                        }}>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">菜品名称</label>
                                    <input name="name" defaultValue={currentDish?.name} required className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="如：佛跳墙" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">类别</label>
                                    <input name="category" defaultValue={currentDish?.category} required className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="如：热菜" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">价格 (¥)</label>
                                    <input type="number" step="0.01" name="price" defaultValue={currentDish?.price} required className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase ml-1">图片链接</label>
                                    <input name="imageUrl" defaultValue={currentDish?.imageUrl} required className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" placeholder="https://..." />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase ml-1">简要说明</label>
                                <textarea name="description" defaultValue={currentDish?.description} required rows={3} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold resize-none" placeholder="描述菜品的特色、口感等..." />
                            </div>

                            <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                保 存 菜 品 信 息
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DishManagement;
