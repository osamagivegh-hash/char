"use client";
import { useState, useEffect, FormEvent } from "react";
import { AppContent, HeroSlide, Initiative, Program } from "@/types";
import { Trash2, Plus, UploadCloud, Edit3, Image as ImageIcon } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";

export default function DashboardHome() {
  const [data, setData] = useState<AppContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [slideForm, setSlideForm] = useState({ title: "", subtitle: "", href: "", src: "" });
  const [slideFile, setSlideFile] = useState<File | null>(null);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);

  const [heroImage, setHeroImage] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const [initForm, setInitForm] = useState({ title: "", desc: "", tag: "", amount: "", image: "", link: "" });
  const [editingInit, setEditingInit] = useState<number | null>(null);

  const [programForm, setProgramForm] = useState({ title: "", desc: "", icon: "", image: "", link: "" });
  const [editingProgram, setEditingProgram] = useState<number | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch(`${API}/content`);
      const json = await res.json();
      setData(json);
      setHeroImage(json.heroImage || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("dashboard_token"));
    refresh();
  }, []);

  const handleSubmitSlide = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return alert("الرجاء تسجيل الدخول مجدداً");
    const formData = new FormData();
    if (slideFile) formData.append("image", slideFile);
    formData.append("title", slideForm.title);
    formData.append("subtitle", slideForm.subtitle);
    formData.append("href", slideForm.href);
    if (slideForm.src) formData.append("src", slideForm.src);

    const url = editingSlide ? `${API}/dashboard/hero/${editingSlide}` : `${API}/dashboard/hero`;
    await fetch(url, {
      method: editingSlide ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    setSlideForm({ title: "", subtitle: "", href: "", src: "" });
    setSlideFile(null);
    setEditingSlide(null);
    refresh();
  };

  const handleDeleteSlide = async (id: number) => {
    if (!token) return;
    if (!confirm("حذف هذه الشريحة؟")) return;
    await fetch(`${API}/dashboard/hero/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  const handleSaveHeroImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const formData = new FormData();
    if (heroImageFile) formData.append("image", heroImageFile);
    if (heroImage) formData.append("heroImage", heroImage);
    await fetch(`${API}/dashboard/hero-image`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    setHeroImageFile(null);
    refresh();
  };

  const handleSubmitInitiative = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const url = editingInit ? `${API}/dashboard/initiatives/${editingInit}` : `${API}/dashboard/initiatives`;
    await fetch(url, {
      method: editingInit ? "PUT" : "POST",
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(initForm)
    });
    setInitForm({ title: "", desc: "", tag: "", amount: "", image: "", link: "" });
    setEditingInit(null);
    refresh();
  };

  const handleDeleteInitiative = async (id: number) => {
    if (!token) return;
    if (!confirm("حذف المبادرة؟")) return;
    await fetch(`${API}/dashboard/initiatives/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  const handleSubmitProgram = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return alert("الرجاء تسجيل الدخول مجدداً");
    const url = editingProgram ? `${API}/dashboard/programs/${editingProgram}` : `${API}/dashboard/programs`;
    await fetch(url, {
      method: editingProgram ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(programForm),
    });
    setProgramForm({ title: "", desc: "", icon: "", image: "", link: "" });
    setEditingProgram(null);
    refresh();
  };

  const handleDeleteProgram = async (id: number) => {
    if (!token) return;
    if (!confirm("حذف البرنامج؟")) return;
    await fetch(`${API}/dashboard/programs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    refresh();
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center text-teal-600">جاري التحميل...</div>;

  return (
    <div className="space-y-8" dir="rtl">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
          <UploadCloud size={24} className="text-teal-600"/> إدارة شرائح الهيرو
        </h2>

        <form onSubmit={handleSubmitSlide} className="grid md:grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <input className="input-field" placeholder="العنوان الرئيسي" value={slideForm.title} onChange={e => setSlideForm({ ...slideForm, title: e.target.value })} required />
          <input className="input-field" placeholder="العنوان الفرعي" value={slideForm.subtitle} onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })} />
          <input className="input-field" placeholder="رابط الزر (اختياري)" value={slideForm.href} onChange={e => setSlideForm({ ...slideForm, href: e.target.value })} />
          <input className="input-field" placeholder="رابط صورة بديل (اختياري)" value={slideForm.src} onChange={e => setSlideForm({ ...slideForm, src: e.target.value })} />
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" onChange={e => setSlideFile(e.target.files?.[0] || null)} />
          </div>
          <button type="submit" className="md:col-span-2 bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition flex justify-center items-center gap-2">
            {editingSlide ? <Edit3 size={18}/> : <Plus size={18}/>}
            {editingSlide ? "تحديث الشريحة" : "إضافة شريحة"}
          </button>
        </form>

        <div className="grid md:grid-cols-3 gap-6">
          {data.heroSlides.map((slide: HeroSlide) => (
            <div key={slide.id} className="relative group rounded-xl overflow-hidden shadow-md border border-slate-200">
              <div className="h-48 w-full relative">
                <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-2 left-2 flex gap-2">
                <button onClick={() => handleDeleteSlide(slide.id)} className="bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 transition shadow-sm">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => { setEditingSlide(slide.id); setSlideForm({ title: slide.title, subtitle: slide.subtitle, href: slide.href || "", src: slide.src }); }} className="bg-white text-slate-800 p-2 rounded-full shadow">
                  <Edit3 size={18} />
                </button>
              </div>
              <div className="p-4 bg-white space-y-1">
                <p className="font-bold text-slate-800 truncate">{slide.title}</p>
                <p className="text-sm text-slate-500 truncate">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
          <ImageIcon size={20} className="text-teal-600" /> صورة الهيرو الأساسية
        </h2>
        <form onSubmit={handleSaveHeroImage} className="grid md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <input className="input-field" placeholder="رابط صورة" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />
          <button type="submit" className="md:col-span-2 bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900">حفظ الصورة</button>
        </form>
        {heroImage && (
          <div className="mt-4">
            <img src={heroImage} alt="Hero" className="rounded-xl border border-slate-200 w-full max-h-64 object-cover" />
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-slate-800">إدارة المبادرات</h2>
        <form onSubmit={handleSubmitInitiative} className="grid md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <input className="input-field" placeholder="عنوان المبادرة" value={initForm.title} onChange={e => setInitForm({ ...initForm, title: e.target.value })} required />
          <input className="input-field" placeholder="الوسم (مثال: مياه)" value={initForm.tag} onChange={e => setInitForm({ ...initForm, tag: e.target.value })} required />
          <input className="input-field" placeholder="المبلغ (مثال: 500 ر.س)" value={initForm.amount} onChange={e => setInitForm({ ...initForm, amount: e.target.value })} />
          <input className="input-field" placeholder="رابط صورة المبادرة" value={initForm.image} onChange={e => setInitForm({ ...initForm, image: e.target.value })} />
          <input className="input-field" placeholder="رابط التفاصيل" value={initForm.link} onChange={e => setInitForm({ ...initForm, link: e.target.value })} />
          <textarea className="input-field md:col-span-2" placeholder="الوصف" value={initForm.desc} onChange={e => setInitForm({ ...initForm, desc: e.target.value })} required rows={3} />
          <button type="submit" className="md:col-span-2 bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2">
            {editingInit ? <Edit3 size={18}/> : <Plus size={18}/>} {editingInit ? "تحديث" : "حفظ"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {data.initiatives.map((item: Initiative) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">{item.tag}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingInit(item.id);
                    setInitForm({
                      title: item.title,
                      desc: item.desc,
                      tag: item.tag,
                      amount: item.amount,
                      image: item.image || "",
                      link: item.link || "",
                    });
                  }}
                  className="text-slate-600 hover:text-teal-700"
                >
                  <Edit3 size={18}/>
                </button>
                <button onClick={() => handleDeleteInitiative(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-slate-800">إدارة البرامج</h2>
        <form onSubmit={handleSubmitProgram} className="grid md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <input
            className="input-field"
            placeholder="عنوان البرنامج"
            value={programForm.title}
            onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="أيقونة (نص أو رمز)"
            value={programForm.icon}
            onChange={(e) => setProgramForm({ ...programForm, icon: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="رابط صورة البرنامج"
            value={programForm.image}
            onChange={(e) => setProgramForm({ ...programForm, image: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="رابط التفاصيل"
            value={programForm.link}
            onChange={(e) => setProgramForm({ ...programForm, link: e.target.value })}
          />
          <textarea
            className="input-field md:col-span-2"
            placeholder="الوصف"
            value={programForm.desc}
            onChange={(e) => setProgramForm({ ...programForm, desc: e.target.value })}
            required
            rows={3}
          />
          <button
            type="submit"
            className="md:col-span-2 bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
          >
            {editingProgram ? <Edit3 size={18} /> : <Plus size={18} />} {editingProgram ? "تحديث البرنامج" : "إضافة برنامج"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {data.programs.map((program: Program) => (
            <div key={program.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <div className="text-2xl">{program.icon || "📌"}</div>
                <h4 className="font-bold text-slate-800">{program.title}</h4>
                <p className="text-sm text-slate-600">{program.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProgram(program.id);
                    setProgramForm({
                      title: program.title,
                      desc: program.desc,
                      icon: program.icon,
                      image: program.image || "",
                      link: program.link || "",
                    });
                  }}
                  className="text-slate-600 hover:text-teal-700"
                >
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDeleteProgram(program.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
