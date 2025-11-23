import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppContent, Initiative } from "@/types";

async function getData(): Promise<AppContent> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";
  const res = await fetch(`${baseUrl}/content`, { cache: "no-store" });
  if (!res.ok) {
    return {
      heroSlides: [],
      heroImage: "",
      initiatives: [],
      programs: [],
      messages: [],
      about: { title: "", description: "" },
      contact: { phone: "", email: "", address: "" },
      vision: { title: "", description: "" },
      mission: { title: "", description: "" },
      donate: { title: "", description: "", bank: "", link: "" },
      volunteer: { title: "", description: "", steps: [] },
    };
  }
  return res.json();
}

export default async function InitiativeDetails({ params }: { params: { id: string } }) {
  const data = await getData();
  const initiative = data.initiatives.find((item: Initiative) => item.id === Number(params.id));

  if (!initiative) {
    notFound();
  }

  const coverImage = initiative.image || data.heroImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="relative h-80 w-full overflow-hidden">
        <Image src={coverImage} alt={initiative.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-6 right-6 text-white space-y-2">
          <p className="text-sm text-teal-100">تفاصيل المبادرة</p>
          <h1 className="text-3xl font-bold">{initiative.title}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/40">{initiative.tag}</span>
            {initiative.amount && <span className="font-semibold">الهدف: {initiative.amount}</span>}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">عن المبادرة</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{initiative.desc}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">معلومات سريعة</h3>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li><strong>الوسم:</strong> {initiative.tag}</li>
              {initiative.amount && <li><strong>المبلغ:</strong> {initiative.amount}</li>}
            </ul>
            <div className="mt-4 flex gap-3">
              <Link href="/" className="text-teal-700 font-semibold">عودة للرئيسية</Link>
              {initiative.link && (
                <a href={initiative.link} className="text-sm text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg" target="_blank" rel="noreferrer">
                  رابط خارجي
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
