"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";

const navLinks = [
  { href: "/dashboard", label: "الهيرو والمبادرات" },
  { href: "/dashboard/programs", label: "البرامج" },
  { href: "/dashboard/about", label: "عن الجمعية" },
  { href: "/dashboard/vision", label: "الرؤية" },
  { href: "/dashboard/mission", label: "الرسالة" },
  { href: "/dashboard/donate", label: "التبرع" },
  { href: "/dashboard/volunteer", label: "التطوع" },
  { href: "/dashboard/contact", label: "التواصل" },
  { href: "/dashboard/messages", label: "الرسائل" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/dashboard/login") {
      setLoading(false);
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("dashboard_token") : null;
    if (!token) {
      router.replace("/dashboard/login");
      setLoading(false);
      return;
    }
    fetch(`${API}/dashboard/auth/verify`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
      })
      .catch(() => router.replace("/dashboard/login"))
      .finally(() => setLoading(false));
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("dashboard_token");
    router.replace("/dashboard/login");
  };

  if (pathname === "/dashboard/login") {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-teal-600">جاري التحقق من الدخول...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-teal-700 text-lg">لوحة التحكم</Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate-600 hover:text-teal-700">العودة للموقع</Link>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700">تسجيل الخروج</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 grid lg:grid-cols-4 gap-6">
        <aside className="bg-white border border-slate-200 rounded-2xl p-4 h-fit space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-lg ${pathname === link.href ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700 hover:bg-slate-100"}`}
            >
              {link.label}
            </Link>
          ))}
        </aside>
        <section className="lg:col-span-3">{children}</section>
      </div>
    </div>
  );
}
