"use client";
import { useEffect, useState } from "react";
import { Message } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100/api";

export default function MessagesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(localStorage.getItem("dashboard_token"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const res = await fetch(`${API}/dashboard/messages`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        setMessages(json);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  if (loading) return <div className="text-teal-600">جاري التحميل...</div>;

  return (
    <div className="space-y-4" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">الرسائل الواردة</h1>
      {messages.length === 0 ? (
        <p className="text-slate-600">لا توجد رسائل حالياً</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>{msg.name}</span>
                <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</span>
              </div>
              <p className="text-slate-700 mb-1">{msg.email}</p>
              <p className="text-slate-800 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
