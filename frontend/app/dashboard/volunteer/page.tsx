"use client";
import { useEffect, useState, FormEvent } from "react";
import { VolunteerContent } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";

export default function VolunteerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState<VolunteerContent>({ title: "", description: "", steps: [] });
  const [loading, setLoading] = useState(true);
  const [stepsText, setStepsText] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("dashboard_token"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const res = await fetch(`${API}/dashboard/volunteer`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setForm(json || { title: "", description: "", steps: [] });
        setStepsText((json?.steps || []).join("\n"));
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const payload = { ...form, steps: stepsText.split(/\n+/).filter(Boolean) };
    await fetch(`${API}/dashboard/volunteer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    alert("تم الحفظ");
  };

  if (loading) return <div className="text-teal-600">جاري التحميل...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">قسم المتطوعين</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <input className="input-field" placeholder="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="input-field" placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <textarea className="input-field min-h-40" placeholder="الخطوات (سطر لكل خطوة)" value={stepsText} onChange={(e) => setStepsText(e.target.value)} />
        <button type="submit" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold">حفظ</button>
      </form>
    </div>
  );
}
