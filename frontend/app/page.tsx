import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { AppContent } from "@/types";

async function getData(): Promise<AppContent> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";
    const res = await fetch(`${baseUrl}/content`, { cache: "no-store" });
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
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="relative isolate overflow-hidden">
        <div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-white/5 blur-2xl" />
        <SiteHeader />
        <div className="pt-2">
          <Hero slides={data.heroSlides} />
        </div>
      </div>

      <section id="about" className="py-16 container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-teal-50 p-10 relative overflow-hidden">
          <div className="absolute -left-10 -top-10 h-32 w-32 bg-teal-50 rounded-full" />
          <div className="absolute -right-12 bottom-0 h-32 w-32 bg-cyan-50 rounded-full" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">{data.about.title || "عن الجمعية"}</h2>
            <p className="text-slate-700 leading-relaxed max-w-4xl" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {data.about.description || ""}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#vision"
                className="inline-flex items-center gap-2 bg-gradient-to-l from-teal-600 to-cyan-500 text-white px-5 py-3 rounded-full font-semibold shadow-md"
              >
                قراءة المزيد
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-teal-700 font-semibold"
              >
                تواصل معنا
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="py-12 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 shadow-sm">
            <h3 className="text-2xl font-bold text-teal-800 mb-3">{data.vision.title || "رؤيتنا"}</h3>
            <p className="text-slate-700 leading-relaxed">{data.vision.description || ""}</p>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm">
            <h3 className="text-2xl font-bold text-indigo-800 mb-3">{data.mission.title || "رسالتنا"}</h3>
            <p className="text-slate-700 leading-relaxed">{data.mission.description || ""}</p>
          </div>
        </div>
      </section>

      <section id="initiatives" className="py-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-10">
          <div>
            <p className="text-sm text-teal-600 font-semibold">مبادرات موثوقة</p>
            <h2 className="text-3xl font-extrabold text-slate-800">مبادراتنا</h2>
            <p className="text-slate-600">جزء من التفاصيل يظهر هنا مع رابط ينقلك لبقية القصة.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">تابع تفاصيل كل مبادرة</span>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {data.initiatives.length === 0 ? (
            <p className="text-center col-span-3 text-gray-500">لا توجد مبادرات حالياً</p>
          ) : (
            data.initiatives.map((item) => {
              const detailsLink = item.link || `/initiatives/${item.id}`;
              return (
              <div key={item.id} className="group relative rounded-3xl overflow-hidden shadow-xl border border-teal-50 bg-white">
                <div className="relative h-52">
                  <Image
                    src={item.image || data.heroImage || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                  <span className="absolute top-4 right-4 text-xs font-bold text-white bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/40">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p
                    className="text-slate-700 leading-relaxed"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    {item.amount && <span className="text-teal-700 font-bold">{item.amount}</span>}
                    <Link
                      href={detailsLink}
                      className="text-sm font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-2"
                    >
                      تفاصيل المبادرة
                      <span className="inline-block h-2 w-2 rounded-full bg-teal-600" />
                    </Link>
                  </div>
                </div>
              </div>
            );
            })
          )}
        </div>
      </section>

      <section id="programs" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-10">
            <div>
              <p className="text-sm text-teal-600 font-semibold">برامج مبتكرة</p>
              <h2 className="text-3xl font-extrabold text-slate-800">برامجنا</h2>
              <p className="text-slate-600">نعرض لك لمحة قصيرة مع زر للانتقال إلى التفاصيل الكاملة.</p>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span>تحديثات دورية</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.programs.length === 0 ? (
              <p className="text-center col-span-3 text-gray-500">لا توجد برامج حالياً</p>
            ) : (
              data.programs.map((program) => {
                const detailsLink = program.link || `/programs/${program.id}`;
                return (
                <div key={program.id} className="group bg-gradient-to-br from-white to-teal-50 rounded-3xl overflow-hidden shadow-xl border border-teal-100">
                  <div className="relative h-48">
                    <Image
                      src={program.image || data.heroImage || "https://images.unsplash.com/photo-1509099836639-18ba02e2e6ba?auto=format&fit=crop&w=1200&q=80"}
                      alt={program.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-teal-900/20 to-transparent" />
                    <div className="absolute top-4 left-4 text-2xl drop-shadow-lg">{program.icon || "📌"}</div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-lg text-slate-900">{program.title}</h3>
                    <p
                      className="text-sm text-slate-700 leading-relaxed"
                      style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                    >
                      {program.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">عرض سريع</span>
                      <Link
                        href={detailsLink}
                        className="text-sm font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-2"
                      >
                        تفاصيل البرنامج
                        <span className="inline-block h-2 w-2 rounded-full bg-teal-600" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
              })
            )}
          </div>
        </div>
      </section>

      <section id="donate" className="py-16 container mx-auto px-4">
        <div className="bg-gradient-to-l from-teal-700 to-cyan-600 text-white rounded-3xl p-10 shadow-xl overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold mb-4">{data.donate.title || "طرق التبرع"}</h2>
            <p className="text-teal-50 mb-4 leading-relaxed max-w-3xl">{data.donate.description}</p>
            <p className="font-semibold text-lg">{data.donate.bank}</p>
            {data.donate.link && (
              <a href={data.donate.link} className="inline-block mt-5 bg-white text-teal-700 px-6 py-3 rounded-full font-bold shadow-lg">
                تبرع الآن
              </a>
            )}
          </div>
        </div>
      </section>

      <section id="volunteer" className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">{data.volunteer.title || "التطوع"}</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{data.volunteer.description}</p>
            <ul className="space-y-3 text-slate-700">
              {data.volunteer.steps?.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="h-2 w-2 mt-2 rounded-full bg-teal-600" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4">التواصل مع فريق التطوع</h3>
            <p className="text-slate-700 mb-2">الهاتف: {data.contact.phone || ""}</p>
            <p className="text-slate-700">البريد الإلكتروني: {data.contact.email || ""}</p>
          </div>
        </div>
      </section>

      <div id="contact">
        <SiteFooter contact={data.contact} donate={data.donate} />
      </div>
    </main>
  );
}