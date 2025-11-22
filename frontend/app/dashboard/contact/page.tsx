"use client";
import { useEffect, useState, FormEvent } from "react";
import { ContactContent } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";

export default function ContactPage() {
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState<ContactContent>({ phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(localStorage.getItem("dashboard_token"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const res = await fetch(`${API}/dashboard/contact`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setForm(json || { phone: "", email: "", address: "" });
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await fetch(`${API}/dashboard/contact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    alert("تم الحفظ");
  };

  if (loading) return <div className="text-teal-600">جاري التحميل...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">معلومات التواصل</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <input className="input-field" placeholder="الهاتف" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input-field" placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea className="input-field min-h-32" placeholder="العنوان" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button type="submit" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold">حفظ</button>
      </form>
    </div>
  );
}
