"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { HeroSlide } from "@/types";

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slides.length)
    return <div className="h-96 bg-gradient-to-l from-teal-700 to-cyan-500 text-white flex items-center justify-center rounded-b-[48px] shadow-lg">لا توجد شرائح للعرض</div>;

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-slate-900 rounded-b-[48px] shadow-2xl shadow-teal-900/20" dir="ltr">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative min-w-full h-full flex-shrink-0">
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4" dir="rtl">
              <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">{slide.title}</h1>
                <p className="text-xl text-slate-100 max-w-2xl mx-auto">{slide.subtitle}</p>
                {slide.href && (
                  <a href={slide.href} className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-bold transition">
                    اكتشف المزيد
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-sm transition">
        <ChevronLeft size={32} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-sm transition">
        <ChevronRight size={32} />
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${current === idx ? "w-8 bg-teal-500" : "w-3 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}