"use client";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "#about", label: "عن الجمعية" },
  { href: "#vision", label: "رؤيتنا" },
  { href: "#initiatives", label: "المبادرات" },
  { href: "#programs", label: "البرامج" },
  { href: "#volunteer", label: "التطوع" },
  { href: "#contact", label: "اتصل بنا" }
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 text-white">
      <div className="bg-gradient-to-l from-teal-800 via-teal-700 to-cyan-500 shadow-lg shadow-teal-900/10 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              جمعية إنماء
            </Link>
            <span className="hidden md:inline-flex text-sm text-white/80">الصانع الذي يصنع الفرق</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
            <Link
              href="#donate"
              className="bg-white text-teal-700 px-4 py-2 rounded-full font-bold shadow-md hover:-translate-y-0.5 transition"
            >
              تبرع الآن
            </Link>
          </nav>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden border border-white/30 rounded-full px-4 py-2 text-sm font-semibold bg-white/10"
          >
            القائمة
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-white text-slate-800 border-t border-white/20 px-4 pb-4 space-y-3">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="block" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <Link
              href="#donate"
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-full font-bold"
              onClick={() => setOpen(false)}
            >
              تبرع الآن
            </Link>
            <Link
              href="/dashboard"
              className="inline-block border border-slate-200 text-slate-800 px-4 py-2 rounded-lg"
              onClick={() => setOpen(false)}
            >
              لوحة التحكم
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
