import React, { useState, useEffect } from 'react';
import * as api from '../../../apiService';

const ConfigManagement: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [reasons, setReasons] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        try {
            const [catData, reasonData] = await Promise.all([
                api.fetchConfig('dish_categories'),
                api.fetchConfig('event_reasons')
            ]);
            setCategories(catData.values || []);
            setReasons(reasonData.values || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (id: string, label: string, values: string[]) => {
        try {
            await api.saveConfig({ id, label, values });
            alert('保存成功');
        } catch (error) {
            alert('保存失败');
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">系统配置</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ConfigSection
                    title="菜品分类"
                    description="管理出现在点餐页面的菜品筛选分类"
                    values={categories}
                    onChange={setCategories}
                    onSave={() => handleSave('dish_categories', '菜品分类', categories)}
                />
                <ConfigSection
                    title="活动事由"
                    description="管理客户录入信息时的预设事由（如：寿宴、满月）"
                    values={reasons}
                    onChange={setReasons}
                    onSave={() => handleSave('event_reasons', '活动事由', reasons)}
                />
            </div>
        </div>
    );
};

const ConfigSection: React.FC<{
    title: string;
    description: string;
    values: string[];
    onChange: (v: string[]) => void;
    onSave: () => void;
}> = ({ title, description, values, onChange, onSave }) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = () => {
        if (!inputValue.trim()) return;
        if (values.includes(inputValue.trim())) return;
        onChange([...values, inputValue.trim()]);
        setInputValue('');
    };

    const removeTag = (tag: string) => {
        onChange(values.filter(v => v !== tag));
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
            <div>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="text-slate-400 text-sm font-bold">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-600">
                {values.map(val => (
                    <div key={val} className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm text-sm font-bold">
                        {val}
                        <button onClick={() => removeTag(val)} className="text-slate-300 hover:text-red-500 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTag()}
                    placeholder="输入新选项..."
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <button onClick={addTag} className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">添加</button>
            </div>

            <button
                onClick={onSave}
                className="w-full bg-primary text-white py-3 rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
            >
                保 存 配 置
            </button>
        </div>
    );
};

export default ConfigManagement;
