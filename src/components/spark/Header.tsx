import { Link } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { useSupport } from "./support-context";

export function Header() {
  const { setOpen } = useSupport();
  const link = "border-b-2 border-transparent px-1 py-1 text-sm font-semibold text-muted-foreground transition hover:text-primary";
  const active = { className: "!border-gold !text-primary" };
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex w-full items-center gap-4 px-6 py-3 lg:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img src="/rbc-logo.png" alt="RBC" className="h-10 w-auto" />
          <span className="font-display text-xl font-bold text-rbc-blue">RBC <span className="text-foreground">Momentum</span></span>
        </Link>
        <nav className="ml-6 flex flex-1 flex-wrap items-center gap-x-6 gap-y-1">
          <Link to="/" className={link} activeOptions={{ exact: true }} activeProps={active}>Home</Link>
          <Link to="/roadmap" className={link} activeProps={active}>Career Roadmap</Link>
          <Link to="/check-in" className={link} activeProps={active}>Bi-Weekly Check-In</Link>
        </nav>
        <SupportButton onClick={() => setOpen(true)} />
      </div>
    </header>
  );
}

export function SupportButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cta px-4 py-2 text-sm font-bold text-accent-foreground shadow-md ring-2 ring-rbc-red/30 transition hover:scale-[1.03]">
      <LifeBuoy className="h-4 w-4 text-rbc-red" /> Seek Support & Career Connect
    </button>
  );
}
