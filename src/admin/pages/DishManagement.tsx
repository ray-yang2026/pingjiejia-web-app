import React, { useState, useEffect } from 'react';
import * as api from '../../../apiService';

const DishManagement: React.FC = () => {
    const [dishes, setDishes] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [ingLibrary, setIngLibrary] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDish, setCurrentDish] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        Promise.all([
            api.fetchDishes(),
            api.fetchConfig('dish_categories'),
            api.fetchIngredientLibrary()
        ]).then(([dishData, catData, ingData]) => {
            setDishes(dishData);
            setCategories(catData.values || []);
            setIngLibrary(ingData);
        }).finally(() => setLoading(false));
    }, []);

    const loadDishes = async () => {
        const data = await api.fetchDishes();
        setDishes(data);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { imageUrl } = await api.uploadImage(file);
            setCurrentDish({ ...currentDish, imageUrl });
        } catch (error) {
            alert('上传失败');
        } finally {
            setUploading(false);
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
                    onClick={() => { setCurrentDish({ ingredients: [] }); setIsModalOpen(true); }}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined">add</span>
                    新增菜品
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12 text-slate-400 font-bold uppercase tracking-widest text-xs">加载中...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dishes.map(dish => (
                        <div key={dish.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider">
                                    {dish.category}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-lg font-black">{dish.name}</h3>
                                        <span className="text-primary font-black">¥{dish.price}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-bold line-clamp-2">{dish.description}</p>
                                </div>

                                {dish.ingredients && dish.ingredients.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {dish.ingredients.slice(0, 3).map((ing: any) => (
                                            <span key={ing.libId} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-700 rounded text-[10px] text-slate-500 font-bold">
                                                {ing.name}
                                            </span>
                                        ))}
                                        {dish.ingredients.length > 3 && (
                                            <span className="text-[10px] text-slate-300 font-bold">+{dish.ingredients.length - 3}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        onClick={() => { setCurrentDish(dish); setIsModalOpen(true); }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-black text-xs transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xs">edit</span>
                                        编辑
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dish.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
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
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/50">
                            <div>
                                <h3 className="text-xl font-black">{currentDish?.id ? '编辑菜品' : '新增菜品'}</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">请完整填写菜品及原料信息</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto">
                            {/* Left: Basic Info */}
                            <form className="space-y-6" id="dishForm" onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    if (currentDish.id) {
                                        await api.updateDish(currentDish.id, currentDish);
                                    } else {
                                        await api.createDish(currentDish);
                                    }
                                    setIsModalOpen(false);
                                    loadDishes();
                                } catch (err) {
                                    console.error(err);
                                    alert('保存失败');
                                }
                            }}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">菜品名称</label>
                                            <input
                                                value={currentDish?.name || ''}
                                                onChange={e => setCurrentDish({ ...currentDish, name: e.target.value })}
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">价格 (¥)</label>
                                            <input
                                                type="number" step="0.01"
                                                value={currentDish?.price || ''}
                                                onChange={e => setCurrentDish({ ...currentDish, price: parseFloat(e.target.value) })}
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">类别</label>
                                        <select
                                            value={currentDish?.category || ''}
                                            onChange={e => setCurrentDish({ ...currentDish, category: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                        >
                                            <option value="">请选择类别</option>
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">菜品图片</label>
                                        <div className="flex gap-4 items-center">
                                            <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 flex-shrink-0">
                                                {currentDish?.imageUrl ? (
                                                    <img src={currentDish.imageUrl} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <span className="material-symbols-outlined">image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="file" accept="image/*"
                                                    onChange={handleFileUpload}
                                                    disabled={uploading}
                                                    className="hidden" id="imageUpload"
                                                />
                                                <label
                                                    htmlFor="imageUpload"
                                                    className={`cursor-pointer block text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors font-bold text-xs ${uploading ? 'opacity-50' : ''}`}
                                                >
                                                    {uploading ? '上传中...' : '上传本地文件'}
                                                </label>
                                                <input
                                                    placeholder="或者输入 URL"
                                                    value={currentDish?.imageUrl || ''}
                                                    onChange={e => setCurrentDish({ ...currentDish, imageUrl: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none text-[10px] font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">详细描述</label>
                                        <textarea
                                            value={currentDish?.description || ''}
                                            onChange={e => setCurrentDish({ ...currentDish, description: e.target.value })}
                                            required rows={3}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </form>

                            {/* Right: Ingredients */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-2">配料明细 (原材料)</h4>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                    {currentDish?.ingredients?.map((ing: any, idx: number) => (
                                        <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <div className="flex-1">
                                                <div className="text-xs font-black">{ing.name}</div>
                                                <div className="text-[10px] text-slate-400">{ing.category}</div>
                                            </div>
                                            <input
                                                value={ing.amount}
                                                onChange={e => {
                                                    const newIngs = [...currentDish.ingredients];
                                                    newIngs[idx].amount = e.target.value;
                                                    setCurrentDish({ ...currentDish, ingredients: newIngs });
                                                }}
                                                placeholder="用量"
                                                className="w-20 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold outline-none"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newIngs = currentDish.ingredients.filter((_: any, i: number) => i !== idx);
                                                    setCurrentDish({ ...currentDish, ingredients: newIngs });
                                                }}
                                                className="text-slate-300 hover:text-red-500"
                                            >
                                                <span className="material-symbols-outlined text-sm">remove_circle</span>
                                            </button>
                                        </div>
                                    ))}
                                    {(!currentDish?.ingredients || currentDish.ingredients.length === 0) && (
                                        <div className="text-center py-8 text-slate-300 italic text-xs">尚未添加配料</div>
                                    )}
                                </div>

                                <div className="p-4 bg-primary/5 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-primary uppercase">从库中添加</span>
                                    </div>
                                    <select
                                        onChange={e => {
                                            const item = ingLibrary.find(i => i.id === e.target.value);
                                            if (item) {
                                                const parent = ingLibrary.find(p => p.id === item.parentId);
                                                const newIng = {
                                                    libId: item.id,
                                                    name: item.name,
                                                    category: parent?.name || '其他',
                                                    amount: ''
                                                };
                                                setCurrentDish({
                                                    ...currentDish,
                                                    ingredients: [...(currentDish.ingredients || []), newIng]
                                                });
                                            }
                                        }}
                                        className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border-none outline-none text-xs font-bold"
                                    >
                                        <option value="">搜索/选择原材料...</option>
                                        {ingLibrary.filter(i => i.level === 2).map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30">
                            <button
                                type="submit"
                                form="dishForm"
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all tracking-widest uppercase"
                            >
                                确 认 保 存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DishManagement;
