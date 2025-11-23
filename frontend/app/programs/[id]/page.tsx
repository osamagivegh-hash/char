import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppContent, Program } from "@/types";

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

export default async function ProgramDetails({ params }: { params: { id: string } }) {
  const data = await getData();
  const program = data.programs.find((item: Program) => item.id === Number(params.id));

  if (!program) {
    notFound();
  }

  const coverImage = program.image || data.heroImage || "https://images.unsplash.com/photo-1509099836639-18ba02e2e6ba?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="relative h-80 w-full overflow-hidden">
        <Image src={coverImage} alt={program.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-6 right-6 text-white space-y-2">
          <p className="text-sm text-teal-100">تفاصيل البرنامج</p>
          <h1 className="text-3xl font-bold">{program.title}</h1>
          <div className="flex items-center gap-3 text-lg">
            <span>{program.icon || "📌"}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">نبذة عن البرنامج</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">{program.desc}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">خيارات</h3>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-teal-700 font-semibold">عودة للرئيسية</Link>
              {program.link && (
                <a href={program.link} className="text-sm text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg text-center" target="_blank" rel="noreferrer">
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
