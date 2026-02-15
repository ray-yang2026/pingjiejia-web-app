import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DishManagement from './pages/DishManagement';
import SupplierManagement from './pages/SupplierManagement';
import ConfigManagement from './pages/ConfigManagement';
import OrderManagement from './pages/OrderManagement';
import IngredientManagement from './pages/IngredientManagement';
import LoginPage from './pages/LoginPage';

const ROUTE_TITLES: Record<string, string> = {
    '/': '仪表盘',
    '/orders': '订单与客户管理',
    '/dishes': '菜品管理',
    '/ingredients': '原材料库管理',
    '/suppliers': '供应商管理',
    '/config': '系统配置',
};

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('admin_token'));

    if (!isLoggedIn) {
        return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <HashRouter>
            <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h1 className="text-xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            萍姐家后台
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">流动宴席管理系统</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <NavItem to="/" icon="dashboard" label="仪表盘" />
                        <NavItem to="/orders" icon="group" label="客户与订单" />
                        <NavItem to="/dishes" icon="restaurant_menu" label="菜品管理" />
                        <NavItem to="/ingredients" icon="egg_alt" label="原材料库" />
                        <NavItem to="/suppliers" icon="inventory_2" label="供应商管理" />
                        <NavItem to="/config" icon="settings" label="系统配置" />
                    </nav>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-1">
                        <a href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">
                            <span className="material-symbols-outlined">storefront</span>
                            <span className="font-bold">返回前台</span>
                        </a>
                        <button
                            onClick={() => { localStorage.removeItem('admin_token'); setIsLoggedIn(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span className="font-bold">退出登录</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <DynamicHeader />
                    <div className="p-8">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/orders" element={<OrderManagement />} />
                            <Route path="/dishes" element={<DishManagement />} />
                            <Route path="/ingredients" element={<IngredientManagement />} />
                            <Route path="/suppliers" element={<SupplierManagement />} />
                            <Route path="/config" element={<ConfigManagement />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </HashRouter>
    );
};

const DynamicHeader: React.FC = () => {
    const location = useLocation();
    const title = ROUTE_TITLES[location.pathname] || '管理后台';

    return (
        <header className="bg-white dark:bg-slate-800 h-16 border-b border-slate-200 dark:border-slate-700 flex items-center px-8 justify-between sticky top-0 z-10">
            <h2 className="font-bold text-lg">{title}</h2>
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    A
                </div>
                <span className="text-sm font-bold">管理员</span>
            </div>
        </header>
    );
};

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
        </Link>
    );
};

export default App;
