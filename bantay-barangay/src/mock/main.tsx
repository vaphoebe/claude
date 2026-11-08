import React from "react";
import ReactDOM from "react-dom/client";
import {
  LayoutDashboard, ClipboardList, MessageSquareWarning, Newspaper, Wallet, CalendarDays, Award, Pill as PillIcon, Building2, ScrollText,
  Users, FileText, CheckCircle2, Bell, Search, FlaskConical, Zap, Construction, Droplets, ChevronDown,
} from "lucide-react";
import "../index.css";
import { Card, DemoStrip, DemoTag, FlagStripe, Mark, Phone, Pill, Poster, Sun, Star, cx } from "./kit";
import * as S from "./screens";

/* Desktop admin console, 1600×1000 in a browser frame */
function Admin() {
  const nav: [React.ElementType, string][] = [[LayoutDashboard, "Overview"], [ClipboardList, "Document Requests"], [MessageSquareWarning, "Community Reports"], [Newspaper, "Announcements"], [Wallet, "Budget & Projects"], [CalendarDays, "Events"], [Award, "Scholarships"], [PillIcon, "Health Center"], [Building2, "Officials Directory"], [ScrollText, "Audit Log"]];
  const reqs = [["BB-CLR-2026-00125", "Juan P. Dela Cruz", "Barangay Clearance", "Approved", "green"], ["BB-CLR-2026-00121", "Maria S. Santos", "Barangay Clearance", "Submitted", "slate"], ["BB-BUS-2026-00119", "Ramon T. Bautista", "Business Clearance", "Under Review", "yellow"], ["BB-BID-2026-00115", "Pedro A. Villanueva", "Barangay ID", "Ready for Pickup", "blue"], ["BB-GMC-2026-00112", "Ana C. Mendoza", "Good Moral Certificate", "Submitted", "slate"], ["BB-RES-2026-00098", "Liza M. Reyes", "Certificate of Residency", "Released", "green"]] as const;
  return (
    <section id="admin" className="flex h-[1080px] w-[1600px] flex-col bg-gradient-to-br from-[#eef3fd] to-white p-12">
      <div className="mb-6 flex items-center gap-3"><Mark size={48} /><div><div className="text-[24px] font-black text-navy">BANTAY BARANGAY · Admin Console</div><div className="text-[15px] font-semibold text-flagred">Para sa barangay staff — simulated demo, walang totoong admin access</div></div></div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-30px_rgba(6,26,74,.45)] ring-1 ring-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="ml-4 flex-1 rounded-lg bg-white px-3 py-1 text-[12px] text-slate-500">bantay-barangay.demo/admin</div>
        </div>
        <DemoStrip />
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-60 shrink-0 bg-navy-900 p-3 text-white">
            <div className="mb-3 flex items-center gap-2 px-2 py-2"><Mark size={30} /><span className="text-[13px] font-black">ADMIN DEMO</span></div>
            {nav.map(([I, l], i) => <div key={l} className={cx("mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium", i === 0 ? "bg-white/10 text-white" : "text-blue-100/75")}>{i === 0 && <span className="-ml-3 mr-0.5 h-5 w-1 rounded-r bg-sun" />}<I size={17} />{l}</div>)}
            <div className="mt-6 rounded-xl bg-white/5 p-3 text-[11px] text-blue-100/80"><b className="text-sun">Role:</b> Barangay Secretary (demo)<br />Role-based access · lahat ng aksyon ay naka-audit log</div>
          </aside>
          <main className="flex-1 overflow-hidden bg-[#F6F8FC] p-6">
            <div className="flex items-center justify-between">
              <div><div className="text-[24px] font-black text-navy">Magandang umaga, Sec. Talaan</div><div className="text-[13px] text-slate-500">Barangay Pag-asa · Linggo, Nob 8, 2026 <DemoTag /></div></div>
              <div className="flex items-center gap-2"><div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] text-slate-400 ring-1 ring-slate-200"><Search size={15} />Search tracking no.</div><span className="rounded-xl bg-flagred px-4 py-2 text-[13px] font-bold text-white">+ Publish Announcement</span></div>
            </div>
            <div className="mt-5 grid grid-cols-6 gap-3">
              {[["Registered Residents", "4,218", Users, "#0038A8"], ["Pending Requests", "23", FileText, "#b38f00"], ["Active Concerns", "26", MessageSquareWarning, "#CE1126"], ["Resolved Concerns", "102", CheckCircle2, "#16A34A"], ["Upcoming Events", "8", CalendarDays, "#0B2A6F"], ["Announcements (7d)", "6", Bell, "#0038A8"]].map(([l, v, I, c]) => {
                const C = I as React.ElementType;
                return <Card key={l as string} className="p-4"><div className="flex items-center justify-between"><span className="text-[11.5px] font-semibold text-slate-500">{l as string}</span><span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: (c as string) + "18", color: c as string }}><C size={16} /></span></div><div className="mt-1 text-[26px] font-black text-navy">{v as string}</div></Card>;
              })}
            </div>
            <div className="mt-4 grid grid-cols-5 gap-4">
              <Card className="col-span-3 p-4">
                <div className="mb-3 flex items-center justify-between"><div className="text-[15px] font-extrabold text-navy">Document Requests Queue</div><span className="text-[12px] font-bold text-gov">View all ›</span></div>
                <table className="w-full text-left text-[12.5px]">
                  <thead><tr className="text-[11px] uppercase tracking-wider text-slate-400"><th className="pb-2">Tracking No.</th><th>Resident</th><th>Document</th><th>Status</th><th className="text-right">Action</th></tr></thead>
                  <tbody>{reqs.map(([t, n, d, s, tone], i) => (
                    <tr key={t} className={cx("border-t border-slate-100", i === 0 && "bg-sun/10")}>
                      <td className="py-2.5 font-mono font-bold text-navy">{t}</td><td className="text-slate-700">{n}</td><td className="text-slate-600">{d}</td><td><Pill tone={tone}>{s}</Pill></td>
                      <td className="text-right"><span className="inline-flex items-center gap-1 rounded-lg bg-gov px-2.5 py-1 text-[11.5px] font-bold text-white">{i === 0 ? "Mark Ready for Pickup" : "Update"}<ChevronDown size={12} /></span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </Card>
              <Card className="col-span-2 p-4">
                <div className="mb-3 text-[15px] font-extrabold text-navy">Community Reports</div>
                {[[Construction, "Bitak sa kalsada — Purok 2", "BB-2026-000128 · NEW · with photo", "Assign"], [Zap, "Power Interruption — Purok 3", "47 confirmations · Referred to provider", "Update"], [Droplets, "Clogged canal — Purok 4", "6 confirmations · Under Verification", "Assign"]].map(([I, t, s, a], i) => {
                  const C = I as React.ElementType;
                  return (
                    <div key={t as string} className={cx("mb-2 flex items-center gap-3 rounded-xl p-2.5", i === 0 ? "bg-red-50 ring-1 ring-red-200" : "bg-slate-50")}>
                      <span className={cx("grid h-9 w-9 place-items-center rounded-lg", i === 0 ? "bg-flagred text-white" : "bg-white text-gov")}><C size={17} /></span>
                      <div className="flex-1"><div className="text-[12.5px] font-bold text-navy">{t as string}</div><div className="text-[11px] text-slate-500">{s as string}</div></div>
                      <span className="rounded-lg bg-navy px-2.5 py-1 text-[11px] font-bold text-white">{a as string}</span>
                    </div>
                  );
                })}
                <div className="mt-3 rounded-xl border border-gov-100 bg-gov-50 p-3 text-[11.5px]">
                  <div className="font-bold text-navy">Assign BB-2026-000128 to:</div>
                  <div className="mt-1.5 flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 ring-1 ring-slate-200"><span>City Engineering Office (demo)</span><ChevronDown size={14} /></div>
                </div>
              </Card>
            </div>
            <Card className="mt-4 p-4">
              <div className="mb-2 text-[14px] font-extrabold text-navy">Audit Log</div>
              <div className="grid grid-cols-3 gap-3 text-[11.5px] text-slate-600">
                {[["9:42 AM", "sec.talaan", "Approved BB-CLR-2026-00125"], ["9:20 AM", "kag.malaya", "Referred BB-2026-000121 → Electricity Provider"], ["Kahapon", "tre.ingat", "Published Q3 expenditure report (sample)"]].map(([t, u, a]) => <div key={a} className="rounded-lg bg-slate-50 p-2"><b className="text-navy">{t}</b> · {u}<br />{a}</div>)}
              </div>
            </Card>
          </main>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-[14px] font-bold text-[#6b5400]"><FlaskConical size={16} />Demo concept · fictional names and data · not an official government system</div>
    </section>
  );
}

/* 1920×1080 overview collage */
function Overview() {
  const phones = [S.Dashboard, S.Tracking, S.Concern, S.Budget, S.AIChat];
  return (
    <section id="overview" className="relative h-[1080px] w-[1920px] overflow-hidden bg-gradient-to-br from-gov via-navy to-navy-900">
      <Sun size={900} className="absolute -right-72 -top-72" opacity={0.16} />
      <Star size={26} className="absolute left-10 top-[190px]" /><Star size={20} className="absolute left-[46%] top-12" /><Star size={22} className="absolute right-24 bottom-24" />
      <div className="relative z-10 flex items-center justify-between px-20 pt-14">
        <div className="flex items-center gap-4"><Mark size={72} /><div><div className="text-[44px] font-black leading-none tracking-tight text-white">BANTAY BARANGAY</div><div className="mt-1 text-[22px] font-bold text-sun">Serbisyong Barangay, Isang Click Na Lang!</div></div></div>
        <div className="max-w-[640px] text-right text-[22px] font-medium leading-snug text-blue-100">Mas mabilis na serbisyo. Mas transparent na pamahalaan. Mas connected na komunidad.</div>
      </div>
      <div className="absolute left-1/2 top-[205px] flex -translate-x-1/2 items-start gap-7">
        {phones.map((P, i) => (
          <div key={i} style={{ zoom: 0.8, marginTop: [70, 25, 0, 25, 70][i] }}><Phone><P /></Phone></div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20"><FlagStripe className="h-2" /><div className="flex items-center justify-center gap-2 bg-sun py-3 text-[18px] font-extrabold uppercase tracking-wide text-[#3d3000]"><FlaskConical size={20} />Demo Concept — Not an Official Government Service · Fictional barangay, officials and data</div></div>
    </section>
  );
}

const posters: [string, string, string, React.FC, boolean?][] = [
  ["01-welcome", "Isang app para sa buong barangay", "Pumili ng probinsya, lungsod, at barangay — at simulan na.", S.Welcome, true],
  ["02-dashboard", "Lahat ng serbisyo, nasa palad mo", "Clearance, reports, budget, health, scholarships at emergency — sa isang tap.", S.Dashboard],
  ["03-clearance", "Barangay Clearance, online na!", "5 simpleng hakbang. Walang pila. Walang paulit-ulit na balik.", S.ClearanceForm],
  ["04-tracking", "Alam mo kung nasaan na ang request mo", "May tracking number, live status, at pickup schedule.", S.Tracking],
  ["05-report-road", "May sira? I-report agad.", "May litrato, mapa, at walang duplicate na report.", S.ReportRoad],
  ["06-concern-tracking", "Brownout? Hindi ka nag-iisa.", "Kumpirmahin ang problema at sundan ang verified updates.", S.Concern],
  ["07-budget", "Saan napupunta ang pondo?", "Malinaw na budget, gastos, at progress ng bawat proyekto.", S.Budget],
  ["08-officials", "Kilalanin ang inyong opisyal", "Komite, responsibilidad, contact at published compensation.", S.Officials],
  ["09-health", "Libreng gamot at konsulta", "Tingnan ang schedule at availability bago pumunta.", S.Health],
  ["10-emergency", "Tulong, isang tap lang", "Hotlines, response team at evacuation centers.", S.Emergency],
  ["11-bantay-ai", "May tanong? Itanong kay Bantay AI", "Sagot sa Filipino o English — batay sa verified na impormasyon.", S.AIChat],
  ["12-finale", "Paano kung ganito na kadali?", "Isang pangarap na digital barangay para sa bawat Pilipino.", S.Finale, true],
];

function App() {
  return (
    <div className="flex flex-col items-start gap-10 bg-slate-300 p-10">
      <Overview />
      <Admin />
      {posters.map(([id, t, s, C, dark], i) => <Poster key={id} id={id} n={i + 1} title={t} sub={s} dark={dark}><C /></Poster>)}
      {posters.map(([id, , , C, dark]) => (
        <section key={"p" + id} id={"plain-" + id} className="grid place-items-center bg-[#eef3fd] p-10"><Phone dark={dark}><C /></Phone></section>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
