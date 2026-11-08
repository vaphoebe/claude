import React from "react";
import {
  FileText, Megaphone, PieChart, Users, HeartPulse, GraduationCap, Bell, CalendarDays, Receipt, Siren, ListChecks, ShieldCheck,
  MapPin, Zap, Construction, ChevronRight, Check, Clock, Upload, Camera, Send, Bot, Sparkles, Mic, ThumbsUp, Paperclip,
  Phone as PhoneIcon, Mail, Award, ArrowRight, Info, Download, Eye, Stethoscope, Droplets, Lightbulb, TriangleAlert, Search, Wallet, IdCard, Gift, Percent, Accessibility, Type,
} from "lucide-react";
import { AIFab, BottomNav, Card, DemoStrip, DemoTag, Mark, Pill, StatusBar, Sun, Star, TopBar, cx, FlagStripe } from "./kit";

const Body = ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={cx("px-4", className)}>{children}</div>;

/* 1 ─ Welcome */
export function Welcome() {
  return (
    <div className="relative h-full bg-gradient-to-b from-gov via-navy to-navy-900 text-white">
      <StatusBar dark />
      <DemoStrip />
      <Sun size={380} className="absolute -right-40 -top-6" opacity={0.18} />
      <Star className="absolute right-8 top-[110px]" size={16} /><Star className="absolute right-24 top-[150px]" size={11} />
      <div className="relative px-6 pt-5">
        <div className="flex items-center gap-3"><Mark size={52} /><div className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold">FIL · EN</div></div>
        <h1 className="mt-4 text-[36px] font-black leading-[1.02] tracking-tight">BANTAY<br />BARANGAY</h1>
        <div className="mt-2 inline-block rounded-lg bg-sun px-2.5 py-1 text-[13px] font-extrabold text-navy">Serbisyong Barangay, Isang Click Na Lang!</div>
        <p className="mt-4 text-[15px] leading-snug text-blue-100">Mas mabilis na serbisyo. Mas transparent na pamahalaan. Mas connected na komunidad.</p>
      </div>
      <div className="relative mx-4 mt-4 rounded-3xl bg-white p-4 text-slate-900 shadow-2xl">
        <div className="mb-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">Piliin ang inyong barangay</div>
        {[["Province", "Albay"], ["City / Municipality", "Legazpi City (demo)"], ["Barangay", "Barangay Gapo"]].map(([l, v], i) => (
          <div key={l} className={cx("mb-2 flex items-center gap-3 rounded-xl border px-3 py-2.5", i === 2 ? "border-gov bg-gov-50" : "border-slate-200")}>
            <MapPin size={16} className={i === 2 ? "text-flagred" : "text-slate-400"} />
            <div className="flex-1"><div className="text-[10px] font-semibold text-slate-500">{l}</div><div className="text-[14px] font-bold text-navy">{v}</div></div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        ))}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-flagred py-3 text-[14px] font-extrabold text-white shadow-lg shadow-red-700/25">Explore My Barangay <ArrowRight size={16} /></div>
          {[[FileText, "Request Documents"], [Megaphone, "Report a Concern"], [PieChart, "View Budget"], [Siren, "Emergency"]].map(([I, l]) => {
            const C = I as typeof FileText;
            return <div key={l as string} className="flex items-center gap-2 rounded-xl bg-gov-50 px-3 py-2.5 text-[12.5px] font-bold text-gov"><C size={16} />{l as string}</div>;
          })}
        </div>
      </div>
      <div className="relative mx-4 mt-3 rounded-2xl border border-sun/50 bg-sun/15 p-3 text-[11.5px] font-semibold text-sun">
        DEMO ONLY — This is a proposed digital barangay platform. Hindi ito opisyal na serbisyo ng gobyerno.
      </div>
    </div>
  );
}

/* 2 ─ Resident Dashboard */
export function Dashboard() {
  const tiles: [React.ElementType, string, string][] = [
    [FileText, "Barangay Clearance", "#0038A8"], [Award, "Certificates", "#0038A8"], [Megaphone, "Report a Concern", "#CE1126"],
    [Users, "Officials", "#0B2A6F"], [PieChart, "Budget", "#0B2A6F"], [HeartPulse, "Health & Medicines", "#CE1126"],
    [GraduationCap, "Scholarships", "#0038A8"], [Bell, "Announcements", "#b38f00"], [Siren, "Emergency", "#CE1126"],
    [CalendarDays, "Events", "#0038A8"], [Receipt, "Taxes & Fees", "#0B2A6F"], [ListChecks, "Track Requests", "#b38f00"],
  ];
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar />
      <Body className="pt-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gov to-navy p-4 text-white">
          <Sun size={150} className="absolute -right-16 -top-16" opacity={0.3} />
          <div className="text-[12px] font-semibold text-blue-200">Linggo, Nobyembre 8</div>
          <div className="text-[22px] font-black">Magandang araw, Juan! 👋</div>
          <div className="text-[13px] text-blue-100">Welcome to Barangay Gapo.</div>
          <div className="mt-3 flex gap-2 text-[11px] font-bold">
            <span className="rounded-full bg-white/15 px-2.5 py-1">1 request in review</span>
            <span className="rounded-full bg-sun px-2.5 py-1 text-navy">2 bagong anunsyo</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-flagred p-3 text-white shadow-lg shadow-red-700/25">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20"><TriangleAlert size={18} /></span>
          <div className="flex-1 text-[12px] leading-tight"><b className="block text-[13px]">Weather Advisory: Malakas na ulan ngayong gabi</b>Purok 6–7: ihanda ang go-bag. Evacuation center naka-standby.</div>
          <ChevronRight size={16} />
        </div>
        <div className="mt-4 mb-2 flex items-center justify-between"><div className="text-[15px] font-extrabold text-navy">Mga Serbisyo</div><span className="text-[12px] font-bold text-gov">Lahat ›</span></div>
        <div className="grid grid-cols-4 gap-2">
          {tiles.map(([I, l, c]) => (
            <div key={l} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2 pb-2.5 text-center shadow-sm ring-1 ring-slate-200/70">
              <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: c + "14", color: c }}><I size={20} /></span>
              <span className="text-[10px] font-bold leading-tight text-slate-700">{l}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 mb-2 text-[15px] font-extrabold text-navy">Latest Barangay Updates</div>
        {[[Zap, "Scheduled power interruption — Nob 12", "Purok 2, 3, 4 · 8AM–3PM", "#b38f00"], [Stethoscope, "Libreng medical consultation ngayong Sabado", "Health Center · Verified", "#CE1126"]].map(([I, t, s, c]) => {
          const C = I as typeof Zap;
          return (
            <Card key={t as string} className="mb-2 flex items-center gap-3 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: (c as string) + "18", color: c as string }}><C size={18} /></span>
              <div className="flex-1"><div className="text-[12.5px] font-bold text-navy">{t as string}</div><div className="text-[11px] text-slate-500">{s as string}</div></div>
            </Card>
          );
        })}
      </Body>
      <AIFab /><BottomNav active={0} />
    </div>
  );
}

/* 3 ─ Clearance application form */
export function ClearanceForm() {
  const steps = ["Info", "Purpose", "Requirements", "Review", "Submit"];
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Apply for Barangay Clearance" />
      <Body className="pt-4">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <span className={cx("grid h-8 w-8 place-items-center rounded-full text-[12px] font-black", i < 2 ? "bg-gov text-white" : i === 2 ? "bg-sun text-navy ring-4 ring-sun/30" : "bg-slate-200 text-slate-500")}>{i < 2 ? <Check size={15} /> : i + 1}</span>
                <span className={cx("text-[9.5px] font-bold", i === 2 ? "text-navy" : "text-slate-500")}>{s}</span>
              </div>
              {i < 4 && <span className={cx("mb-4 h-0.5 flex-1", i < 2 ? "bg-gov" : "bg-slate-200")} />}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-flagred">Step 3 of 5</div>
        <div className="text-[20px] font-black text-navy">Requirements</div>
        <p className="text-[12.5px] text-slate-600">I-upload ang mga sumusunod. (Simulated upload — walang totoong file na ipapadala.)</p>
        {[["Valid government-issued ID", "juan-id-demo.jpg", true], ["Proof of residency (utility bill)", "meralco-bill-demo.pdf", true], ["Cedula, kung kinakailangan", "", false]].map(([l, f, ok]) => (
          <Card key={l as string} className="mt-2.5 flex items-center gap-3 p-3">
            <span className={cx("grid h-10 w-10 place-items-center rounded-xl", ok ? "bg-green-50 text-green-600" : "bg-gov-50 text-gov")}>{ok ? <Check size={18} /> : <Upload size={18} />}</span>
            <div className="flex-1"><div className="text-[12.5px] font-bold text-navy">{l as string}</div><div className="text-[11px] text-slate-500">{ok ? `${f} · uploaded` : "PDF/JPG, max 5MB"}</div></div>
            {!ok && <span className="rounded-lg bg-gov px-2.5 py-1.5 text-[11px] font-bold text-white">Upload</span>}
          </Card>
        ))}
        <Card className="mt-3 p-3">
          <div className="flex items-center justify-between text-[12.5px]"><span className="font-semibold text-slate-600">Sample fee</span><span className="font-black text-navy">₱50.00 <DemoTag /></span></div>
          <div className="mt-1 flex items-center justify-between text-[12.5px]"><span className="font-semibold text-slate-600">Processing time</span><span className="font-bold text-navy">To be confirmed by barangay</span></div>
          <div className="mt-2 rounded-lg bg-gov-50 p-2 text-[10.5px] text-gov">Bayad sa barangay hall lamang. Walang online payment sa demo na ito.</div>
        </Card>
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gov" />Pumapayag akong gamitin ang aking datos para lamang sa request na ito, alinsunod sa Data Privacy Act of 2012.
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-center text-[14px] font-bold text-navy">Back</div>
          <div className="flex-[2] rounded-xl bg-gov py-3 text-center text-[14px] font-bold text-white shadow-lg shadow-blue-800/25">Next: Review →</div>
        </div>
      </Body>
    </div>
  );
}

/* 4 ─ Tracking number + tracker */
export function Tracking() {
  const st = [["Submitted", "Nob 8, 9:42 AM"], ["Under Review", "Nob 8, 1:10 PM"], ["Approved", "Nob 9, 10:05 AM"], ["Ready for Pickup", "Pumili ng schedule"], ["Released", ""]];
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Track My Request" />
      <Body className="pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gov to-navy p-5 text-center text-white">
          <Sun size={200} className="absolute -left-16 -top-16" opacity={0.25} />
          <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-sun text-navy ring-8 ring-white/10"><Check size={30} strokeWidth={3} /></div>
          <div className="relative mt-3 text-[18px] font-black">Application Successfully Submitted!</div>
          <div className="relative mt-1 text-[11px] font-semibold text-blue-200">DEMO TRACKING NUMBER</div>
          <div className="relative mx-auto mt-1 inline-block rounded-xl bg-white px-4 py-2 font-mono text-[20px] font-black tracking-wider text-navy">BB-CLR-2026-00125</div>
          <div className="relative mt-2 text-[11.5px] text-blue-100">Barangay Clearance · Purpose: Employment</div>
        </div>
        <Card className="mt-3 p-4">
          <div className="mb-3 flex items-center justify-between"><div className="text-[14px] font-extrabold text-navy">Status</div><Pill tone="blue">Ready for Pickup</Pill></div>
          {st.map(([s, d], i) => (
            <div key={s} className="relative flex gap-3 pb-3.5 last:pb-0">
              {i < 4 && <span className={cx("absolute left-[13px] top-7 h-[calc(100%-22px)] w-0.5", i < 3 ? "bg-gov" : "bg-slate-200")} />}
              <span className={cx("relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-black", i < 3 ? "bg-gov text-white" : i === 3 ? "bg-flagred text-white ring-4 ring-red-100" : "bg-slate-200 text-slate-500")}>{i < 3 ? <Check size={14} /> : i + 1}</span>
              <div><div className={cx("text-[13px] font-bold", i === 3 ? "text-flagred" : i < 3 ? "text-navy" : "text-slate-400")}>{s}</div>{d && <div className="text-[11px] text-slate-500">{d}</div>}</div>
            </div>
          ))}
        </Card>
        <Card className="mt-3 p-4">
          <div className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><CalendarDays size={16} className="text-gov" />Pickup Schedule</div>
          <div className="mt-2 grid grid-cols-4 gap-1.5 text-center">
            {[["Lun", "10"], ["Mar", "11"], ["Miy", "12"], ["Huw", "13"]].map(([d, n], i) => (
              <div key={n} className={cx("rounded-xl py-1.5", i === 1 ? "bg-gov text-white" : "bg-slate-100 text-slate-700")}><div className="text-[10px] font-semibold opacity-80">{d}</div><div className="text-[16px] font-black">{n}</div></div>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">{["9:00 AM", "10:30 AM", "2:00 PM"].map((t, i) => <span key={t} className={cx("flex-1 rounded-lg py-1.5 text-center text-[11px] font-bold", i === 1 ? "bg-sun text-navy" : "bg-slate-100 text-slate-600")}>{t}</span>)}</div>
          <div className="mt-3 rounded-xl bg-green-50 p-2.5 text-[11.5px] font-semibold text-green-800">✓ Appointment confirmed (simulated): Martes, Nob 11 · 10:30 AM · Barangay Hall</div>
        </Card>
      </Body>
    </div>
  );
}

/* 5 ─ Report a concern: power outage */
export function Concern() {
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Community Concerns" />
      <Body className="pt-3">
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {[["128", "Total"], ["17", "Pending"], ["9", "In Progress"], ["102", "Resolved"]].map(([v, l], i) => (
            <div key={l} className={cx("rounded-xl p-2", ["bg-gov-50", "bg-sun/25", "bg-gov-50", "bg-green-50"][i])}><div className="text-[17px] font-black text-navy">{v}</div><div className="text-[9.5px] font-bold text-slate-600">{l}</div></div>
          ))}
        </div>
        <div className="mt-1 text-right text-[10px] text-slate-500">Avg. resolution: 2.4 days · <DemoTag /></div>
        <Card className="mt-2 overflow-hidden">
          <div className="flex items-center gap-2 bg-sun/20 px-3 py-2"><Zap size={16} className="text-[#8a6d00]" /><span className="text-[11px] font-black text-[#6b5400]">POWER INTERRUPTION</span><span className="ml-auto font-mono text-[10px] text-slate-500">BB-2026-000121</span></div>
          <div className="p-3">
            <div className="text-[16px] font-black text-navy">Power Interruption — Purok 3</div>
            <div className="mt-1 rounded-xl bg-slate-50 p-2.5 text-[12.5px] italic text-slate-700">“Wala pong kuryente sa aming lugar for almost 10 hours.”</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div><div className="text-slate-500">Reported</div><div className="font-bold text-navy">Nob 8 · 6:15 AM</div></div>
              <div><div className="text-slate-500">Responsible</div><div className="font-bold text-navy">Electricity Provider (fictional)</div></div>
            </div>
            <div className="mt-2.5"><Pill tone="blue">● Referred to Responsible Office</Pill></div>
            <div className="mt-2.5 flex gap-1">{[1, 1, 1, 0, 0, 0].map((d, i) => <span key={i} className={cx("h-1.5 flex-1 rounded-full", d ? "bg-gov" : "bg-slate-200")} />)}</div>
            <div className="mt-2.5 rounded-xl border-l-4 border-gov bg-gov-50 p-2.5 text-[11.5px] text-navy"><b>Latest verified update · 9:20 AM</b><br />Crew dispatched to inspect damaged transformer sa Mabini St.</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-2">{["#0038A8", "#CE1126", "#FCD116", "#0B2A6F"].map((c) => <span key={c} className="h-6 w-6 rounded-full ring-2 ring-white" style={{ background: c }} />)}</div>
              <div className="text-[11.5px] font-bold text-navy">47 residents confirmed</div>
            </div>
            <div className="mt-2.5 flex items-center justify-center gap-2 rounded-xl bg-flagred py-2.5 text-[13px] font-extrabold text-white"><ThumbsUp size={16} />Ako rin, apektado ako</div>
          </div>
        </Card>
        <div className="mt-3 flex items-center justify-between"><div className="text-[14px] font-extrabold text-navy">Malapit sa iyo</div><span className="text-[11px] font-bold text-gov">Map view ›</span></div>
        <Card className="mt-2 flex items-center gap-3 p-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-flagred"><Construction size={18} /></span>
          <div className="flex-1"><div className="text-[12.5px] font-bold text-navy">Bitak sa kalsada — malapit sa school</div><div className="text-[10.5px] text-slate-500">Purok 2 · 19 confirmations</div></div>
          <Pill tone="yellow">In Progress</Pill>
        </Card>
      </Body>
      <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gov px-5 py-3 text-[13px] font-extrabold text-white shadow-xl shadow-blue-900/30">+ Mag-report ng Problema</div>
      <BottomNav active={2} />
    </div>
  );
}

/* 6 ─ Report road damage with photo + map */
export function ReportRoad() {
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Report a Concern" />
      <Body className="pt-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Category</div>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5">
          {[[Construction, "Road", true], [Lightbulb, "Streetlight"], [Zap, "Power"], [Droplets, "Water/Flood"]].map(([I, l, a]) => {
            const C = I as typeof Zap;
            return <div key={l as string} className={cx("flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-bold", a ? "bg-gov text-white" : "bg-white text-slate-600 ring-1 ring-slate-200")}><C size={18} />{l as string}</div>;
          })}
        </div>
        <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Location</div>
        <div className="relative mt-1.5 h-[150px] overflow-hidden rounded-2xl bg-[#e8eef6] ring-1 ring-slate-200">
          <svg viewBox="0 0 358 150" className="absolute inset-0 h-full w-full">
            <rect width="358" height="150" fill="#eaf0e6" />
            <path d="M0 95 H358" stroke="#fff" strokeWidth="16" /><path d="M150 0 V150" stroke="#fff" strokeWidth="12" /><path d="M260 0 L300 150" stroke="#fff" strokeWidth="10" />
            <rect x="30" y="20" width="90" height="55" rx="6" fill="#cfdcf6" /><text x="75" y="52" fontSize="9" textAnchor="middle" fill="#0B2A6F" fontWeight="700">Gapo Elem. School</text>
            <rect x="175" y="18" width="70" height="50" rx="6" fill="#dfe7d6" /><rect x="180" y="110" width="60" height="32" rx="6" fill="#dfe7d6" />
            <text x="8" y="90" fontSize="8" fill="#64748b">Rizal St.</text>
          </svg>
          <div className="absolute left-[118px] top-[60px] flex flex-col items-center">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-flagred text-white shadow-lg ring-4 ring-white"><MapPin size={18} /></span>
            <span className="mt-1 rounded bg-white px-1.5 text-[9px] font-bold text-navy shadow">Rizal St., Purok 2</span>
          </div>
        </div>
        <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Description</div>
        <div className="mt-1.5 rounded-xl border border-gov bg-white p-3 text-[13px] text-slate-800 ring-4 ring-blue-500/10">Malaking bitak sa kalsada malapit sa elementary school. Delikado sa mga batang tumatawid.</div>
        <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Photo</div>
        <div className="mt-1.5 flex gap-2">
          <div className="relative h-[84px] w-[110px] overflow-hidden rounded-xl bg-gradient-to-br from-slate-500 to-slate-700">
            <svg viewBox="0 0 110 84" className="absolute inset-0"><path d="M0 60 L110 40 L110 84 L0 84Z" fill="#475569" /><path d="M20 70 L40 58 L48 66 L62 52 L70 60 L90 50" stroke="#1e293b" strokeWidth="3" fill="none" /></svg>
            <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[8px] font-bold text-white">DEMO PHOTO</span>
          </div>
          <div className="grid h-[84px] w-[84px] place-items-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400"><Camera size={22} /></div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-sun/20 p-2.5 text-[11px] text-[#5c4800]"><Info size={14} className="mt-0.5 shrink-0" /><span><b>May katulad na report:</b> BB-2026-000118 (19 residents). Idadagdag ang iyong report doon para walang duplicate.</span></div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-flagred py-3 text-[14px] font-extrabold text-white shadow-lg shadow-red-700/25"><Send size={16} />Submit Report</div>
        <div className="mt-1.5 text-center text-[10px] text-slate-500">Hindi ipapakita sa publiko ang iyong pangalan at numero.</div>
      </Body>
    </div>
  );
}

/* 7 ─ Budget transparency */
export function Budget() {
  const cats = [["Infrastructure", 30, "#0038A8"], ["Administrative", 27, "#0B2A6F"], ["Healthcare", 12, "#CE1126"], ["Youth (SK)", 10, "#FCD116"], ["Education", 8, "#5b8def"], ["Community", 8, "#f08a98"], ["Disaster Prep.", 5, "#c9a400"]] as const;
  let acc = 0;
  const R = 52, C = 2 * Math.PI * R;
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Budget Transparency" />
      <Body className="pt-3">
        <div className="flex items-center justify-between">
          <div className="text-[19px] font-black leading-tight text-navy">Saan Napupunta ang<br />Pondo ng Barangay?</div>
          <div className="rounded-xl bg-navy px-3 py-1.5 text-[13px] font-black text-sun">2026 ▾</div>
        </div>
        <div className="mt-1"><DemoTag /> <span className="text-[10px] text-slate-500">Lahat ng halaga ay halimbawa lamang.</span></div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[["Approved Budget", "₱12.50M", "text-navy"], ["Reported Spent", "₱8.38M", "text-gov"], ["Remaining", "₱4.12M", "text-green-700"], ["Utilization", "67%", "text-flagred"]].map(([l, v, c]) => (
            <Card key={l} className="p-3"><div className="text-[10.5px] font-semibold text-slate-500">{l}</div><div className={cx("text-[20px] font-black", c)}>{v}</div></Card>
          ))}
        </div>
        <Card className="mt-3 flex items-center gap-3 p-3">
          <svg viewBox="0 0 140 140" width="132" height="132" className="shrink-0 -rotate-90">
            {cats.map(([l, p, c]) => { const len = (p / 100) * C; const el = <circle key={l} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="22" strokeDasharray={`${len - 1.5} ${C}`} strokeDashoffset={-acc} />; acc += len; return el; })}
          </svg>
          <div className="flex-1 space-y-1">
            {cats.map(([l, p, c]) => <div key={l} className="flex items-center gap-1.5 text-[10.5px]"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} /><span className="flex-1 font-semibold text-slate-700">{l}</span><span className="font-black text-navy">{p}%</span></div>)}
          </div>
        </Card>
        <Card className="mt-3 p-3">
          <div className="mb-2 text-[12.5px] font-extrabold text-navy">Allocated vs. Spent</div>
          {[["Infra", 3.75, 2.43], ["Admin", 3.38, 2.71], ["Health", 1.5, 1.02], ["Youth", 1.25, 0.61]].map(([l, a, s]) => (
            <div key={l as string} className="mb-1.5 flex items-center gap-2 text-[10px]">
              <span className="w-10 font-semibold text-slate-600">{l as string}</span>
              <div className="relative h-3.5 flex-1 rounded bg-gov-50"><div className="absolute inset-y-0 left-0 rounded bg-gov-100" style={{ width: `${((a as number) / 4) * 100}%` }} /><div className="absolute inset-y-0 left-0 rounded bg-gov" style={{ width: `${((s as number) / 4) * 100}%` }} /></div>
              <span className="w-9 text-right font-bold text-navy">₱{s as number}M</span>
            </div>
          ))}
        </Card>
        <Card className="mt-3 p-3">
          <div className="flex items-start justify-between"><div className="text-[13.5px] font-extrabold text-navy">Drainage Improvement Project</div><Pill tone="blue">Ongoing</Pill></div>
          <div className="mt-1 grid grid-cols-2 text-[10.5px] text-slate-600"><span>Approved: <b className="text-navy">₱500,000</b></span><span>Spent: <b className="text-navy">₱325,000</b></span><span>Start: Jul 1, 2026</span><span>Target: Dec 15, 2026</span></div>
          <div className="mt-2 flex items-center gap-2"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[65%] rounded-full bg-gradient-to-r from-gov to-flagred" /></div><b className="text-[12px] text-navy">65%</b></div>
        </Card>
        <div className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-gov py-2.5 text-[12.5px] font-bold text-gov"><Download size={15} />Download sample report (PDF)</div>
      </Body>
    </div>
  );
}

/* 8 ─ Officials */
export function Officials() {
  const kag = [["RM", "Hon. Ricardo B. Malaya", "Infrastructure", "#0038A8"], ["GM", "Hon. Gloria S. Mabini", "Health & Sanitation", "#CE1126"], ["EP", "Hon. Ernesto D. Pagdanganan", "Peace & Order", "#0B2A6F"], ["LM", "Hon. Lourdes A. Matapat", "Education & Culture", "#b38f00"]];
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Barangay Officials" />
      <Body className="pt-3">
        <div className="text-[19px] font-black leading-tight text-navy">Kilalanin ang Inyong<br />Barangay Officials</div>
        <div className="mt-1 text-[11px] text-slate-500">Fictional officials for demonstration · Term 2023–2026 (sample)</div>
        <div className="relative mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-gov p-4 text-white">
          <Sun size={160} className="absolute -right-14 -top-14" opacity={0.2} />
          <div className="relative flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sun text-[22px] font-black text-navy">TL</div>
            <div><span className="rounded-full bg-sun px-2 py-0.5 text-[10px] font-black text-navy">PUNONG BARANGAY</span><div className="mt-1 text-[16px] font-black">Hon. Teresita M. Lualhati</div><div className="text-[11px] text-blue-200">Executive · Peace & Order</div></div>
          </div>
          <div className="relative mt-3 text-[11.5px] leading-snug text-blue-100">Nagpapatupad ng ordinansa, namumuno sa sesyon ng Sangguniang Barangay, at nangunguna sa paghahatid ng serbisyo.</div>
          <div className="relative mt-3 flex gap-2 text-[11px] font-bold">
            <span className="flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1"><PhoneIcon size={12} />(052) 000-0001</span>
            <span className="flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1"><Mail size={12} />Email</span>
          </div>
        </div>
        <div className="mt-3 mb-2 text-[13px] font-extrabold text-navy">Sangguniang Barangay Members</div>
        <div className="grid grid-cols-2 gap-2">
          {kag.map(([i, n, c, col]) => (
            <Card key={n} className="p-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl text-[14px] font-black text-white" style={{ background: col }}>{i}</div>
              <div className="mt-2 text-[11.5px] font-black leading-tight text-navy">{n}</div>
              <div className="text-[10px] font-semibold text-slate-500">Kagawad · {c}</div>
            </Card>
          ))}
        </div>
        <Card className="mt-3 p-3">
          <div className="flex items-center justify-between"><div className="text-[13px] font-extrabold text-navy">Compensation & Allowances</div><DemoTag /></div>
          <div className="mt-2 divide-y divide-slate-100 text-[11px]">
            {[["Punong Barangay", "₱25,000", "₱3,000"], ["Kagawad (×7)", "₱20,000", "₱2,000"], ["SK Chairperson", "₱20,000", "₱2,000"], ["Secretary / Treasurer", "₱15,000", "₱1,500"]].map(([p, h, a]) => (
              <div key={p} className="flex py-1.5"><span className="flex-1 font-semibold text-slate-700">{p}</span><span className="w-16 text-right font-bold text-navy">{h}</span><span className="w-14 text-right text-slate-500">+{a}</span></div>
            ))}
          </div>
          <div className="mt-1.5 text-[9.5px] text-slate-500">Illustrative figures only · Source: Sample Annual Budget (fictional) · Updated Nov 2026</div>
        </Card>
      </Body>
    </div>
  );
}

/* 9 ─ Bantay AI */
export function AIChat() {
  return (
    <div className="relative h-full bg-[#F6F8FC]">
      <StatusBar /><DemoStrip />
      <div className="flex items-center gap-3 bg-gradient-to-r from-gov to-navy px-4 py-3 text-white">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun text-navy"><Bot size={24} /></span>
        <div className="flex-1"><div className="flex items-center gap-1 text-[16px] font-black">Bantay AI <Sparkles size={14} className="text-sun" /></div><div className="text-[11px] text-blue-100">May tanong ka? Nandito ako para tumulong!</div></div>
        <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold">FIL · EN</span>
      </div>
      <Body className="space-y-2.5 pt-3">
        <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-gov px-3.5 py-2.5 text-[13px] text-white">May scholarship ba para sa college students?</div>
        <div className="flex gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun text-navy"><Bot size={15} /></span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white p-3 text-[12.5px] text-slate-800 shadow-sm ring-1 ring-slate-200">
            Opo! Batay sa <b>demo data</b> ng Brgy. Gapo, may bukas na:
            <div className="mt-2 rounded-xl border border-slate-200 p-2.5">
              <div className="flex items-center gap-1.5 text-[12.5px] font-black text-navy"><GraduationCap size={15} className="text-gov" />Gapo Iskolar ng Barangay</div>
              <div className="mt-1 text-[11px] text-slate-600">₱5,000/semester (sample) · College</div>
              <div className="mt-1 inline-block rounded bg-red-50 px-1.5 py-0.5 text-[10.5px] font-bold text-flagred">Deadline: Nob 30, 2026</div>
            </div>
            <div className="mt-2 text-[11.5px]"><b>Requirements:</b> Certificate of Enrollment, grades, Certificate of Residency, proof of income.</div>
            <div className="mt-2 flex gap-1.5"><span className="rounded-lg bg-gov px-2.5 py-1.5 text-[11px] font-bold text-white">Tingnan ang detalye</span><span className="rounded-lg bg-gov-50 px-2.5 py-1.5 text-[11px] font-bold text-gov">Request Residency Cert.</span></div>
            <div className="mt-2 border-t border-slate-100 pt-1.5 text-[9.5px] text-slate-500">Source: Sample Resolution No. 2026-014 (fictional). Kumpirmahin sa Education Committee.</div>
          </div>
        </div>
        <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-gov px-3.5 py-2.5 text-[13px] text-white">Brownout na kami for 10 hours. Saan ako magrereport?</div>
        <div className="flex gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun text-navy"><Bot size={15} /></span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white p-3 text-[12.5px] text-slate-800 shadow-sm ring-1 ring-slate-200">
            May aktibong report na para sa <b>Purok 3</b> (BB-2026-000121, 47 residents). Pindutin ang “Ako rin” para madagdag ang iyong kumpirmasyon.
            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-sun/25 px-2.5 py-1.5 text-[11px] font-bold text-[#5c4800]"><Zap size={13} />Buksan ang report →</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {["Magkano ang clearance?", "May libreng gamot ba?", "Budget ng barangay"].map((q) => <span key={q} className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gov ring-1 ring-gov-100">{q}</span>)}
        </div>
      </Body>
      <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white px-3 pb-7 pt-2.5">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-[13px] text-slate-400"><Paperclip size={16} />Magtanong kay Bantay AI…</div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-gov"><Mic size={18} /></span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-flagred text-white"><Send size={17} /></span>
        </div>
        <div className="mt-1.5 text-center text-[9.5px] text-slate-500">Scripted demo · Hindi nagbibigay ng reseta o opisyal na desisyon.</div>
      </div>
    </div>
  );
}

/* 10 ─ Health */
export function Health() {
  const meds = [["Paracetamol 500mg", "Available", "green"], ["Oral Rehydration Salts", "Limited Stock", "yellow"], ["Maintenance Medicine", "Contact Health Center", "blue"], ["Cetirizine", "Out of Stock", "red"]] as const;
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Health Center & Medicines" />
      <Body className="pt-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-flagred to-[#9c0c1c] p-4 text-white">
          <Sun size={160} className="absolute -right-10 -top-10" opacity={0.3} />
          <HeartPulse size={26} />
          <div className="mt-1 text-[18px] font-black">Barangay Health Center</div>
          <div className="text-[11.5px] text-red-100">Lun–Biy · 8:00 AM – 5:00 PM · Purok 1 (demo)</div>
          <div className="mt-2 inline-block rounded-lg bg-sun px-2 py-1 text-[11px] font-black text-navy">Libreng konsulta ngayong Sabado</div>
        </div>
        <div className="mt-3 flex items-center justify-between"><div className="text-[14px] font-extrabold text-navy">Medicine Availability</div><DemoTag /></div>
        <div className="text-[10.5px] text-slate-500">Last verified: Nob 6, 2026</div>
        <div className="mt-2 space-y-1.5">
          {meds.map(([m, s, t]) => <Card key={m} className="flex items-center justify-between p-3"><span className="text-[12.5px] font-bold text-navy">{m}</span><Pill tone={t}>{s}</Pill></Card>)}
        </div>
        <div className="mt-2 rounded-xl bg-sun/20 p-2.5 text-[10.5px] text-[#5c4800]">Kumpirmahin ang aktwal na availability sa health center. Hindi nagrereseta ng gamot ang app o ang AI.</div>
        <div className="mt-3 mb-2 text-[14px] font-extrabold text-navy">Weekly Schedule</div>
        {[["Lun", "General Consultation"], ["Mar", "Prenatal & Maternal Care"], ["Miy", "Child Immunization"], ["Huw", "Senior Citizen Check-up"]].map(([d, s]) => (
          <div key={d} className="mb-1.5 flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-slate-200/70"><span className="grid h-9 w-11 place-items-center rounded-lg bg-gov-50 text-[12px] font-black text-gov">{d}</span><span className="text-[12px] font-semibold text-slate-700">{s}</span></div>
        ))}
      </Body>
      <BottomNav active={4} />
    </div>
  );
}

/* 11 ─ Emergency */
export function Emergency() {
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Emergency Assistance" />
      <Body className="pt-3">
        <div className="rounded-3xl bg-flagred p-4 text-center text-white shadow-lg shadow-red-700/30">
          <Siren size={30} className="mx-auto" />
          <div className="mt-1 text-[18px] font-black">Barangay Emergency Response Team</div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-[20px] font-black text-flagred"><PhoneIcon size={20} />0900-000-0101</div>
          <div className="mt-1.5 text-[10.5px] font-semibold text-red-100">Fictional demo number · 24/7</div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[["Police", "#0B2A6F"], ["Fire", "#ea580c"], ["Ambulance", "#16A34A"], ["City DRRM", "#0038A8"]].map(([l, c], i) => (
            <Card key={l} className="p-3"><span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: c }}><PhoneIcon size={16} /></span><div className="mt-1.5 text-[12.5px] font-black text-navy">{l}</div><div className="text-[11px] font-mono text-slate-500">0900-000-010{i + 2}</div></Card>
          ))}
        </div>
        <div className="mt-3 mb-2 text-[14px] font-extrabold text-navy">Evacuation Centers</div>
        {[["Gapo Elementary School", "400 capacity", "Standby"], ["Barangay Covered Court", "250 capacity", "Standby"]].map(([n, c, s]) => (
          <Card key={n} className="mb-1.5 flex items-center gap-3 p-3"><MapPin size={18} className="text-flagred" /><div className="flex-1"><div className="text-[12.5px] font-bold text-navy">{n}</div><div className="text-[10.5px] text-slate-500">{c}</div></div><Pill tone="yellow">{s}</Pill></Card>
        ))}
        <div className="mt-2 rounded-2xl bg-gov-50 p-3"><div className="text-[12.5px] font-black text-navy">Go-Bag Checklist</div><div className="mt-1 text-[11px] text-slate-600">Tubig · Pagkain · Flashlight · Gamot · Kopya ng ID · Powerbank · Whistle</div></div>
      </Body>
      <BottomNav active={4} />
    </div>
  );
}

/* 12 ─ Senior Citizens */
export function Seniors() {
  return (
    <div className="relative h-full">
      <StatusBar /><DemoStrip /><TopBar back title="Senior Citizens" />
      <Body className="pt-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gov to-navy p-4 text-white">
          <Sun size={150} className="absolute -right-14 -top-14" opacity={0.25} />
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-sun"><Accessibility size={14} />PARA SA ATING MGA LOLO AT LOLA</div>
          <div className="mt-1 text-[19px] font-black leading-tight">Serbisyo para sa Senior Citizens</div>
          <div className="mt-1 text-[11.5px] text-blue-100">Barangay Gapo · 612 registered seniors <span className="font-bold text-sun">(sample)</span></div>
        </div>
        <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-sun/25 p-2.5">
          <Type size={18} className="text-navy" />
          <div className="flex-1 text-[12px] font-bold text-navy">Mas malaking letra</div>
          <span className="relative h-6 w-11 rounded-full bg-gov"><span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white" /></span>
        </div>
        <Card className="mt-2.5 overflow-hidden">
          <div className="flex items-center gap-2 bg-gov-50 px-3 py-2"><Wallet size={16} className="text-gov" /><span className="text-[12.5px] font-black text-navy">Social Pension Payout</span><span className="ml-auto"><DemoTag /></span></div>
          <div className="p-3">
            <div className="flex items-end justify-between">
              <div><div className="text-[10.5px] text-slate-500">Susunod na payout (sample)</div><div className="text-[17px] font-black text-navy">Nob 20, 2026 · 8:00 AM</div><div className="text-[11px] text-slate-600">Barangay Covered Court · Purok 1–4</div></div>
              <Pill tone="green">Scheduled</Pill>
            </div>
            <div className="mt-2 rounded-lg bg-slate-50 p-2 text-[10.5px] text-slate-600">Dalhin: Senior Citizen ID · valid ID · authorization letter kung may kinatawan</div>
          </div>
        </Card>
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          {([
            [IdCard, "OSCA / Senior ID", "Paano mag-apply", "#0038A8"],
            [Percent, "20% Discount + VAT Exempt", "Gamot, pagkain, transportasyon", "#CE1126"],
            [Stethoscope, "Libreng Check-up", "Tuwing Huwebes · BP & sugar", "#0B2A6F"],
            [Gift, "Birthday Cash Gift", "Para sa 80+ (sample)", "#b38f00"],
          ] as const).map(([I, t, d, c]) => (
            <Card key={t} className="flex items-center gap-2 p-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: c + "16", color: c }}><I size={18} /></span>
              <div><div className="text-[11.5px] font-black leading-tight text-navy">{t}</div><div className="text-[9.5px] leading-tight text-slate-500">{d}</div></div>
            </Card>
          ))}
        </div>
        <Card className="mt-2.5 flex items-center gap-3 p-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-flagred"><CalendarDays size={20} /></span>
          <div className="flex-1"><div className="text-[12.5px] font-black text-navy">Senior Citizens' Wellness Day</div><div className="text-[10.5px] text-slate-500">Nob 20 · 9:00 AM · Zumba, BP screening</div></div>
          <span className="rounded-lg bg-gov px-2.5 py-1.5 text-[11px] font-bold text-white">RSVP</span>
        </Card>
        <div className="mt-2.5 flex items-center justify-center gap-2 rounded-2xl bg-flagred py-3 text-[14px] font-extrabold text-white shadow-lg shadow-red-700/25"><PhoneIcon size={17} />Humingi ng Tulong / Home Visit</div>
        <div className="mt-1.5 text-center text-[9.5px] text-slate-500">Halimbawang impormasyon lamang. Kumpirmahin sa OSCA ng inyong lungsod/munisipyo.</div>
      </Body>
    </div>
  );
}

/* Final message scene */
export function Finale() {
  return (
    <div className="relative flex h-full flex-col bg-gradient-to-b from-gov via-navy to-navy-900 text-white">
      <StatusBar dark /><DemoStrip />
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <Sun size={300} opacity={0.9} />
        <div className="absolute left-8 top-16"><Star size={22} /></div><div className="absolute right-10 top-24"><Star size={22} /></div><div className="absolute bottom-16 left-10"><Star size={16} /></div>
        <div className="mt-4 text-[26px] font-black leading-tight">“Paano kung ganito na kadali ang barangay services sa Pilipinas?”</div>
        <FlagStripe className="mt-6 w-24 rounded-full" />
        <div className="mt-6 text-[20px] font-black">BANTAY BARANGAY</div>
        <div className="text-[13px] font-bold text-sun">Serbisyong Barangay, Isang Click Na Lang!</div>
      </div>
    </div>
  );
}
