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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-teal-700">جمعية إنماء</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-teal-700 transition">
              {item.label}
            </a>
          ))}
          <Link href="/dashboard" className="border border-teal-600 text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50">
            لوحة التحكم
          </Link>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden border border-slate-300 rounded-lg px-3 py-2 text-slate-700">
          القائمة
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pb-4 space-y-3">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="block text-slate-700" onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <Link href="/dashboard" className="inline-block border border-teal-600 text-teal-600 px-4 py-2 rounded-lg" onClick={() => setOpen(false)}>
            لوحة التحكم
          </Link>
        </div>
      )}
    </header>
  );
}
