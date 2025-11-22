"use client";
import { useEffect, useState, FormEvent } from "react";
import { Program } from "@/types";
import { Plus, Edit3, Trash2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", desc: "", icon: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch(`${API}/dashboard/programs`, { headers: { Authorization: `Bearer ${token}` || "" } });
      if (res.ok) {
        const json = await res.json();
        setPrograms(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("dashboard_token");
    setToken(stored);
  }, []);

  useEffect(() => {
    if (token) refresh();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const url = editingId ? `${API}/dashboard/programs/${editingId}` : `${API}/dashboard/programs`;
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setForm({ title: "", desc: "", icon: "" });
    setEditingId(null);
    refresh();
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("حذف البرنامج؟")) return;
    await fetch(`${API}/dashboard/programs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  if (loading) return <div className="text-teal-600">جاري التحميل...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">إدارة البرامج</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <input className="input-field" placeholder="عنوان البرنامج" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input-field" placeholder="أيقونة (نص أو رمز)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        <textarea className="input-field md:col-span-2" placeholder="الوصف" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} required rows={3} />
        <button type="submit" className="md:col-span-2 bg-teal-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
          {editingId ? <Edit3 size={18}/> : <Plus size={18}/>}
          {editingId ? "تحديث البرنامج" : "إضافة برنامج"}
        </button>
      </form>

      <div className="space-y-3">
        {programs.map((program) => (
          <div key={program.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-2xl">{program.icon || "📌"}</div>
              <h3 className="font-bold text-slate-800">{program.title}</h3>
              <p className="text-sm text-slate-600">{program.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditingId(program.id); setForm({ title: program.title, desc: program.desc, icon: program.icon }); }} className="text-slate-600 hover:text-teal-700"><Edit3 size={18}/></button>
              <button onClick={() => handleDelete(program.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
