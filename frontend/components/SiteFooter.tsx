import { ContactContent, DonateContent } from "@/types";

interface Props {
  contact: ContactContent;
  donate: DonateContent;
}

export default function SiteFooter({ contact, donate }: Props) {
  return (
    <footer className="bg-slate-900 text-slate-100 mt-16" id="contact">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">جمعية إنماء</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            نسعى لتقديم مبادرات مستدامة تعزز جودة الحياة وتدعم المحتاجين في مجتمعنا.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">معلومات التواصل</h4>
          <ul className="space-y-2 text-sm text-slate-200">
            <li>الهاتف: {contact.phone || "-"}</li>
            <li>البريد الإلكتروني: {contact.email || "-"}</li>
            <li>العنوان: {contact.address || "-"}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">التبرع</h4>
          <p className="text-sm text-slate-200 mb-2">{donate.description}</p>
          <p className="text-sm text-slate-200 mb-2">{donate.bank}</p>
          {donate.link && (
            <a
              href={donate.link}
              className="inline-block mt-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              ادعمنا الآن
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-400">
        جميع الحقوق محفوظة © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
