import React from "react";
import { FlaskConical, Home, FileText, Megaphone, PieChart, LayoutGrid, Bot } from "lucide-react";

export const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Philippine-flag inspired mark: blue/red shield with the 8-ray yellow sun. */
export function Mark({ size = 36 }: { size?: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <rect width="64" height="64" rx="16" fill="#fff" />
      <path d="M32 10l18 6.5V30c0 12-8 20.5-18 24-10-3.5-18-12-18-24V16.5z" fill="#0038A8" />
      <path d="M32 10l18 6.5V30c0 12-8 20.5-18 24z" fill="#CE1126" />
      <g transform="translate(32 31)" fill="#FCD116">
        <circle r="6" />
        {rays.map((r) => <path key={r} d="M0-14l1.8 5.5h-3.6z" transform={`rotate(${r})`} />)}
      </g>
    </svg>
  );
}

export function Sun({ size = 120, className, opacity = 1 }: { size?: number; className?: string; opacity?: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} style={{ opacity }} aria-hidden>
      <g fill="#FCD116">
        <circle r="16" />
        {rays.map((r) => (
          <g key={r} transform={`rotate(${r})`}>
            <path d="M0-46l4 22h-8z" />
            <path d="M0-40l2 14h-4z" transform="rotate(14)" />
            <path d="M0-40l2 14h-4z" transform="rotate(-14)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Star({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path fill="#FCD116" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6z" />
    </svg>
  );
}

export function FlagStripe({ className }: { className?: string }) {
  return <div className={cx("flag-stripe h-1.5 w-full", className)} />;
}

export function DemoStrip() {
  return (
    <div className="flex items-center justify-center gap-1.5 bg-sun px-3 py-[5px] text-[10px] font-extrabold uppercase tracking-wide text-[#3d3000]">
      <FlaskConical size={12} /> Demo Concept — Not an Official Government Service
    </div>
  );
}

export function StatusBar({ dark }: { dark?: boolean }) {
  return (
    <div className={cx("flex h-11 items-center justify-between px-7 text-[15px] font-semibold", dark ? "text-white" : "text-slate-900")}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="11" viewBox="0 0 18 11"><g fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></g></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" /><rect x="23" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".4" /></svg>
      </span>
    </div>
  );
}

export function TopBar({ title, back }: { title?: string; back?: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
      {back ? <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-lg text-navy">‹</span> : <Mark size={30} />}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-extrabold text-navy">{title ?? "BANTAY BARANGAY"}</div>
        {!title && <div className="text-[10px] font-semibold text-slate-500">Brgy. Pag-asa, Albay · Demo</div>}
      </div>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"><span className="rounded-full bg-white px-1.5 py-0.5 text-navy shadow-sm">FIL</span> EN</span>
    </div>
  );
}

export function BottomNav({ active = 0 }: { active?: number }) {
  const items = [[Home, "Home"], [FileText, "Dokumento"], [Megaphone, "Report"], [PieChart, "Budget"], [LayoutGrid, "Iba pa"]] as const;
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-5">
      <div className="grid grid-cols-5">
        {items.map(([I, l], i) => (
          <div key={l} className={cx("relative flex flex-col items-center gap-0.5 pt-2.5 text-[10.5px] font-semibold", i === active ? "text-gov" : "text-slate-400")}>
            {i === active && <span className="absolute top-0 h-1 w-9 rounded-b-full bg-flagred" />}
            <I size={22} />{l}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIFab() {
  return (
    <div className="absolute bottom-24 right-4 flex items-center gap-2 rounded-full bg-gov py-2 pl-2 pr-4 text-[12px] font-bold text-white shadow-xl shadow-blue-900/30 ring-4 ring-white">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-sun text-gov"><Bot size={18} /></span> Bantay AI
    </div>
  );
}

/** iPhone-style device frame. Screen is 390×844. */
export function Phone({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="relative rounded-[58px] bg-[#0b0f1a] p-[12px] shadow-[0_40px_80px_-20px_rgba(6,26,74,0.45),0_0_0_2px_#2a3142_inset]">
      <div className={cx("relative h-[844px] w-[390px] overflow-hidden rounded-[46px]", dark ? "bg-navy" : "bg-[#F6F8FC]")}>
        <div className="absolute left-1/2 top-[11px] z-50 h-[32px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cx("rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,.04),0_6px_18px_-10px_rgba(15,23,42,.12)]", className)}>{children}</div>;
}

export function Pill({ tone = "blue", children }: { tone?: "blue" | "red" | "yellow" | "green" | "slate"; children: React.ReactNode }) {
  const c = { blue: "bg-gov-50 text-gov", red: "bg-red-50 text-flagred", yellow: "bg-sun/25 text-[#6b5400]", green: "bg-green-50 text-green-700", slate: "bg-slate-100 text-slate-600" }[tone];
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold", c)}>{children}</span>;
}

export function DemoTag() {
  return <span className="inline-flex items-center gap-1 rounded bg-sun/30 px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-[#5c4800]"><FlaskConical size={10} />Demo data</span>;
}

/** Facebook-ready 1080×1350 poster with headline + phone */
export function Poster({ id, n, title, sub, children, dark }: { id: string; n: number; title: string; sub: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section id={id} className="relative flex h-[1350px] w-[1080px] flex-col items-center overflow-hidden bg-gradient-to-b from-[#eef3fd] to-white">
      <FlagStripe className="h-3" />
      <Sun size={620} className="absolute -right-56 top-40" opacity={0.18} />
      <div className="absolute -left-40 bottom-[-160px] h-[420px] w-[420px] rounded-full bg-flagred/10 blur-2xl" />
      <div className="relative z-10 mt-12 flex w-full items-start justify-between px-16">
        <div className="flex items-center gap-3">
          <Mark size={56} />
          <div>
            <div className="text-[26px] font-black tracking-tight text-navy">BANTAY BARANGAY</div>
            <div className="text-[16px] font-semibold text-flagred">Serbisyong Barangay, Isang Click Na Lang!</div>
          </div>
        </div>
        <div className="rounded-full bg-navy px-5 py-2 text-[18px] font-black text-sun">{String(n).padStart(2, "0")}</div>
      </div>
      <div className="relative z-10 mt-8 px-16 text-center">
        <h2 className="text-[50px] font-black leading-[1.05] tracking-tight text-navy">{title}</h2>
        <p className="mx-auto mt-3 max-w-[820px] text-[22px] font-medium text-slate-600">{sub}</p>
      </div>
      <div className="relative z-10 mt-8" style={{ zoom: 1.1 }}><Phone dark={dark}>{children}</Phone></div>
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 bg-sun py-3 text-[16px] font-extrabold uppercase tracking-wide text-[#3d3000]">
        <FlaskConical size={18} /> Demo Concept — Not an Official Government Service · Fictional data
      </div>
    </section>
  );
}
