import { Link } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { useSupport } from "./support-context";

export function Logo() {
  return (
    <svg viewBox="0 0 40 44" className="h-9 w-8" aria-hidden>
      <path d="M20 1 L38 7 V22 C38 33 30 40 20 43 C10 40 2 33 2 22 V7 Z" className="fill-rbc-blue" />
      <path d="M20 6 L33 10 V22 C33 30 27 35 20 38 C13 35 7 30 7 22 V10 Z" className="fill-gold" />
      <text x="20" y="28" textAnchor="middle" className="fill-rbc-blue" fontSize="13" fontWeight="800">RBC</text>
    </svg>
  );
}

export function Header() {
  const { setOpen } = useSupport();
  const tab = "rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-primary";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-xl font-bold text-rbc-blue">RBC <span className="text-foreground">Momentum</span></span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full glass p-1 md:flex">
          <Link to="/" className={tab} activeOptions={{ exact: true }} activeProps={{ className: "!bg-primary !text-primary-foreground" }}>Home & Career Roadmap</Link>
          <Link to="/check-in" className={tab} activeProps={{ className: "!bg-primary !text-primary-foreground" }}>Bi-Weekly Buddy Check-In</Link>
        </nav>
        <SupportButton onClick={() => setOpen(true)} />
      </div>
    </header>
  );
}

export function SupportButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-full bg-cta px-4 py-2 text-sm font-bold text-accent-foreground shadow-md ring-2 ring-rbc-red/30 transition hover:scale-[1.03]">
      <LifeBuoy className="h-4 w-4 text-rbc-red" /> Seek Support & Career Connect
    </button>
  );
}
