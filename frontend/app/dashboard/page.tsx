"use client";
import { useState, useEffect, FormEvent } from "react";
import { AppContent } from "@/types";
import { Trash2, Plus, UploadCloud, LayoutDashboard } from "lucide-react";

const API = "http://localhost:4100/api";

export default function Dashboard() {
  const [data, setData] = useState<AppContent | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [slideForm, setSlideForm] = useState({ title: "", subtitle: "", href: "" });
  const [slideFile, setSlideFile] = useState<File | null>(null);

  // Initiative Form State
  const [initForm, setInitForm] = useState({ title: "", desc: "", tag: "", amount: "" });

  const refresh = async () => {
    try {
      const res = await fetch(`${API}/content`);
      const json = await res.json();
      setData(json);
    } catch(e) { console.error(e) } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const handleAddSlide = async (e: FormEvent) => {
    e.preventDefault();
    if (!slideFile) return alert("الرجاء اختيار صورة");
    const formData = new FormData();
    formData.append("image", slideFile);
    formData.append("title", slideForm.title);
    formData.append("subtitle", slideForm.subtitle);
    formData.append("href", slideForm.href);
    await fetch(`${API}/hero`, { method: "POST", body: formData });
    setSlideForm({ title: "", subtitle: "", href: "" });
    setSlideFile(null);
    refresh();
  };

  const handleAddInitiative = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/initiatives`, { 
        method: "POST", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(initForm) 
    });
    setInitForm({ title: "", desc: "", tag: "", amount: "" });
    refresh();
  };

  const handleDelete = async (type: "hero" | "initiatives", id: number) => {
    if(!confirm("هل أنت متأكد؟")) return;
    await fetch(`${API}/${type}/${id}`, { method: "DELETE" });
    refresh();
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center text-teal-600">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-teal-600"/> لوحة التحكم
          </h1>
          <a href="/" className="text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg transition">العودة للموقع</a>
        </header>

        {/* Hero Management */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <UploadCloud size={24} className="text-teal-600"/> إدارة شرائح الهيرو
          </h2>
          
          <form onSubmit={handleAddSlide} className="grid md:grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <input className="input-field" placeholder="العنوان الرئيسي" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} required />
            <input className="input-field" placeholder="العنوان الفرعي" value={slideForm.subtitle} onChange={e => setSlideForm({...slideForm, subtitle: e.target.value})} />
            <input className="input-field" placeholder="رابط الزر (اختياري)" value={slideForm.href} onChange={e => setSlideForm({...slideForm, href: e.target.value})} />
            <div className="flex items-center gap-2">
                <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" onChange={e => setSlideFile(e.target.files?.[0] || null)} required />
            </div>
            <button type="submit" className="md:col-span-2 bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition flex justify-center items-center gap-2">
              <Plus size={18}/> إضافة شريحة
            </button>
          </form>

          <div className="grid md:grid-cols-3 gap-6">
            {data.heroSlides.map(slide => (
              <div key={slide.id} className="relative group rounded-xl overflow-hidden shadow-md border border-slate-200">
                <div className="h-48 w-full relative">
                    <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-2 left-2">
                  <button onClick={() => handleDelete("hero", slide.id)} className="bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 transition shadow-sm">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-4 bg-white">
                  <p className="font-bold text-slate-800 truncate">{slide.title}</p>
                  <p className="text-sm text-slate-500 truncate">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Initiatives Management */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-slate-800">إضافة مبادرة جديدة</h2>
          <form onSubmit={handleAddInitiative} className="grid md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <input className="input-field" placeholder="عنوان المبادرة" value={initForm.title} onChange={e => setInitForm({...initForm, title: e.target.value})} required />
            <input className="input-field" placeholder="الوسم (مثال: مياه)" value={initForm.tag} onChange={e => setInitForm({...initForm, tag: e.target.value})} required />
            <input className="input-field" placeholder="المبلغ (مثال: 500 ر.س)" value={initForm.amount} onChange={e => setInitForm({...initForm, amount: e.target.value})} />
            <textarea className="input-field md:col-span-2" placeholder="الوصف" value={initForm.desc} onChange={e => setInitForm({...initForm, desc: e.target.value})} required rows={3} />
            <button type="submit" className="md:col-span-2 bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition">حفظ المبادرة</button>
          </form>
          
          <div className="mt-6 space-y-4">
            {data.initiatives.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                        <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">{item.tag}</span>
                    </div>
                    <button onClick={() => handleDelete("initiatives", item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20}/></button>
                </div>
            ))}
          </div>
        </section>
      </div>
      
      <style jsx global>{`
        .input-field {
            @apply p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white;
        }
      `}</style>
    </div>
  );
}