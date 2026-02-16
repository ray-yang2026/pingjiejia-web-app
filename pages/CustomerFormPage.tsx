
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { createOrder } from '../apiService';
import { EVENT_REASONS } from '../constants';

interface CustomerFormPageProps {
  addOrder?: (order: Order) => void;
  orders?: Order[];
  updateOrder?: (order: Order) => void;
}

const CustomerFormPage: React.FC<CustomerFormPageProps> = ({ addOrder, orders, updateOrder }) => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const isEditMode = !!orderId;

  const [days, setDays] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('wedding');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && orders) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setName(order.customerName);
        setPhone(order.customerPhone);
        setAddress(order.address);
        setDays(order.daysCount);
        setStartDate(order.startDate);

        // Find key from label, default to 'other'
        const foundReason = EVENT_REASONS.find(r => r.label === order.eventReason);
        setReason(foundReason ? foundReason.value : 'other');
      }
    }
  }, [isEditMode, orderId, orders]);

  const handleSubmit = async () => {
    if (!name || !phone || !startDate) {
      alert('请填写基本信息和办席日期');
      return;
    }

    setSubmitting(true);
    try {
      const eventReasonLabel = EVENT_REASONS.find(r => r.value === reason)?.label || '其他';

      if (isEditMode && updateOrder && orders) {
        // Update existing order
        const existingOrder = orders.find(o => o.id === orderId);
        if (existingOrder) {
          const updatedOrder: Order = {
            ...existingOrder,
            customerName: name,
            customerPhone: phone,
            eventReason: eventReasonLabel,
            address,
            daysCount: days,
            startDate,
            // Keep existing plans/status/id/orderNumber
          };

          // Call the update wrapper which calls the API
          await updateOrder(updatedOrder);
          navigate(`/schedule/${existingOrder.id}`);
        }
      } else if (addOrder) {
        // Create new order
        const newOrder = await createOrder({
          customerName: name,
          customerPhone: phone,
          eventReason: eventReasonLabel,
          address,
          daysCount: days,
          startDate,
        });

        addOrder(newOrder);
        navigate(`/schedule/${newOrder.id}`);
      }
    } catch (err) {
      console.error(isEditMode ? '更新订单失败:' : '创建订单失败:', err);
      alert(isEditMode ? '更新失败，请重试' : '创建订单失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <header className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <span
          onClick={() => navigate(-1)}
          className="material-symbols-outlined text-slate-800 dark:text-slate-200 cursor-pointer p-2 rounded-full hover:bg-slate-50"
        >
          arrow_back_ios_new
        </span>
        <h2 className="flex-1 text-center text-xl font-bold pr-8">{isEditMode ? '修改客户信息' : '客户信息登记'}</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">基本信息</label>
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="客户姓名"
                className="w-full h-14 rounded-2xl border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 focus:ring-primary focus:border-primary font-bold"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="联系电话"
                className="w-full h-14 rounded-2xl border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 focus:ring-primary focus:border-primary font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">办席日期 (首日)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-14 rounded-2xl border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 focus:ring-primary focus:border-primary font-bold"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">事由与地址</label>
            <div className="space-y-4">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-14 rounded-2xl border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 focus:ring-primary focus:border-primary font-bold"
              >
                {EVENT_REASONS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="办席详细地址"
                className="w-full min-h-[100px] rounded-2xl border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 focus:ring-primary focus:border-primary font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-widest">持续天数</label>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl h-14 px-3">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="size-10 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-400 rounded-xl active:bg-slate-100 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined font-bold">remove</span>
              </button>
              <span className="text-xl font-black">{days} 天</span>
              <button
                onClick={() => setDays(days + 1)}
                className="size-10 flex items-center justify-center bg-primary text-white rounded-xl active:opacity-80 shadow-md shadow-primary/20 transition-opacity"
              >
                <span className="material-symbols-outlined font-bold">add</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-10">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full text-white text-xl font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all ${submitting ? 'bg-slate-400' : 'bg-primary'}`}
        >
          {submitting ? '保存中...' : (isEditMode ? '保存修改' : '开始排期')}
        </button>
      </footer>
    </div>
  );
};

export default CustomerFormPage;
