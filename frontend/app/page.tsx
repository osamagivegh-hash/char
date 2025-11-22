import Hero from "@/components/Hero";
import { AppContent } from "@/types";

async function getData(): Promise<AppContent> {
  try {
    const res = await fetch("http://localhost:4100/api/content", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch (e) {
    return { heroSlides: [], initiatives: [], programs: [], messages: [] };
  }
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="p-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center font-bold text-slate-800">
          <span className="text-xl text-teal-700">جمعية إنماء</span>
          <a href="/dashboard" className="text-sm border border-teal-600 text-teal-600 px-4 py-1 rounded hover:bg-teal-50">لوحة التحكم</a>
        </div>
      </header>

      <Hero slides={data.heroSlides} />

      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">مبادراتنا</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {data.initiatives.length === 0 ? (
            <p className="text-center col-span-3 text-gray-500">لا توجد مبادرات حالياً</p>
          ) : (
            data.initiatives.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 transition duration-300 border border-slate-100">
                <div className="p-6">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{item.tag}</span>
                  <h3 className="text-xl font-bold mt-4 mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  {item.amount && <div className="mt-4 font-bold text-teal-700 text-lg">{item.amount}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}