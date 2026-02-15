import React, { useState } from 'react';
import * as api from '../../../apiService';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await api.adminLogin(password);
            if (result.success) {
                localStorage.setItem('admin_token', result.token);
                onLogin();
            }
        } catch {
            setError('密码错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-3xl shadow-xl p-10 space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            萍姐家后台
                        </h1>
                        <p className="text-slate-400 text-sm font-bold">请输入管理密码登录</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">管理密码</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="请输入密码"
                                required
                                autoFocus
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold text-center text-lg tracking-widest"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '验证中...' : '登 录'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6 font-bold">
                    萍姐家流动餐 · 管理系统
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
