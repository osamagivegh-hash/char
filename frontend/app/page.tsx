import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AppContent } from "@/types";

async function getData(): Promise<AppContent> {
  try {
    const res = await fetch("http://localhost:4100/api/content", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  } catch (e) {
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
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      <SiteHeader />

      <Hero slides={data.heroSlides} />

      <section id="about" className="py-16 container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{data.about.title || "عن الجمعية"}</h2>
          <p className="text-slate-600 leading-relaxed">{data.about.description || ""}</p>
        </div>
      </section>

      <section id="vision" className="py-12 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100">
            <h3 className="text-2xl font-bold text-teal-800 mb-2">{data.vision.title || "رؤيتنا"}</h3>
            <p className="text-slate-700 leading-relaxed">{data.vision.description || ""}</p>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">{data.mission.title || "رسالتنا"}</h3>
            <p className="text-slate-700 leading-relaxed">{data.mission.description || ""}</p>
          </div>
        </div>
      </section>

      <section id="initiatives" className="py-16 container mx-auto px-4">
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

      <section id="programs" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">برامجنا</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.programs.length === 0 ? (
              <p className="text-center col-span-3 text-gray-500">لا توجد برامج حالياً</p>
            ) : (
              data.programs.map((program) => (
                <div key={program.id} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-3xl mb-3">{program.icon || "📌"}</div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800">{program.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{program.desc}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="donate" className="py-16 container mx-auto px-4">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">{data.donate.title || "طرق التبرع"}</h2>
          <p className="text-teal-50 mb-4 leading-relaxed">{data.donate.description}</p>
          <p className="font-semibold">{data.donate.bank}</p>
          {data.donate.link && (
            <a href={data.donate.link} className="inline-block mt-4 bg-white text-teal-700 px-6 py-3 rounded-lg font-bold">
              تبرع الآن
            </a>
          )}
        </div>
      </section>

      <section id="volunteer" className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">{data.volunteer.title || "التطوع"}</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{data.volunteer.description}</p>
            <ul className="space-y-2 text-slate-700">
              {data.volunteer.steps?.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">التواصل مع فريق التطوع</h3>
            <p className="text-slate-700 mb-2">الهاتف: {data.contact.phone || ""}</p>
            <p className="text-slate-700">البريد الإلكتروني: {data.contact.email || ""}</p>
          </div>
        </div>
      </section>

      <SiteFooter contact={data.contact} donate={data.donate} />
    </main>
  );
}