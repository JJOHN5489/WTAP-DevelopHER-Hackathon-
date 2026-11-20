import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, X, Sparkles, Coffee, Check, ArrowRight, Briefcase, Cpu, LineChart, Landmark, PiggyBank, BookOpen, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { user, roles, lobs, suggestionMap, type Role } from "@/lib/spark-data";
import { useSupport } from "@/components/spark/support-context";
import { SupportButton } from "@/components/spark/Header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home & Career Roadmap — RBC Momentum" },
      { name: "description", content: "Plan your path from intern to target RBC role with mentors, workshops and AI role suggestions." },
      { property: "og:title", content: "Home & Career Roadmap — RBC Momentum" },
      { property: "og:description", content: "Plan your path to a full-time RBC role with mentors and workshops." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const currentRole: Role = {
  title: "Early Talent Intern", lob: "Capital Markets", intermediate: "",
  skills: ["Excel & financial modelling", "Team communication", "Market fundamentals"],
  workshops: ["Intern Onboarding Week", "Capital Markets 101"], resources: ["Intern Hub on RBC Connect"],
  mentors: [{ name: "Sarah Jenkins", years: 2, area: "RBC Capital Markets" }],
};
const lobIcons: Record<string, typeof Cpu> = { "Technology & Operations": Cpu, "Capital Markets": LineChart, "Wealth Management": PiggyBank, "Personal & Commercial Banking": Landmark };

function Home() {
  const { setOpen } = useSupport();
  const [interests, setInterests] = useState(["AI / ML", "Software Engineering", "Product Management", "Capital Markets"]);
  const [hobbies, setHobbies] = useState(["Gymnastics", "Running", "Hackathons"]);
  const [target, setTarget] = useState<Role>(roles[0]!);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [drawer, setDrawer] = useState<Role | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [lobFilter, setLobFilter] = useState<string | null>(null);

  const matches = roles.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  const intermediate: Role = { ...target, title: target.intermediate, skills: target.skills.slice(0, 2), mentors: target.mentors.slice(0, 1) };
  const nodes = [{ label: "Current Role", role: currentRole }, { label: "Intermediate Step", role: intermediate }, { label: "Target Role", role: target }];

  const suggestions = useMemo(() => {
    const titles = new Set([...interests, ...hobbies].flatMap((t) => suggestionMap[t] ?? []));
    return roles.filter((r) => titles.has(r.title) && (!lobFilter || r.lob === lobFilter));
  }, [interests, hobbies, lobFilter]);

  const progress = (r: Role) => { const n = r.skills.filter((s) => done[r.title + s]).length; return Math.round((n / r.skills.length) * 100); };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <section className="glass bg-welcome flex flex-wrap items-center gap-5 p-6">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-4 ring-gold">{user.initials}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">Welcome back 👋</p>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.title}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground"><GraduationCap className="h-4 w-4" /> {user.school}</p>
        </div>
        <SupportButton onClick={() => setOpen(true)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[35fr_65fr]">
        <div className="space-y-6">
          <section className="glass p-5">
            <h2 className="mb-4 font-bold">Current Role & Timeline</h2>
            <div className="relative h-2 rounded-full bg-muted"><div className="absolute inset-y-0 left-0 w-[55%] rounded-full bg-primary" /></div>
            <div className="mt-3 flex justify-between text-xs font-semibold">
              <span className="text-primary">Role Start<br /><span className="text-muted-foreground">May</span></span>
              <span className="text-center text-primary">Mid-Point Review<br /><span className="text-muted-foreground">July</span></span>
              <span className="text-right">Target Conversion<br /><span className="text-muted-foreground">August</span></span>
            </div>
          </section>
          <section className="glass space-y-4 p-5">
            <h2 className="font-bold">Interests & Hobbies</h2>
            <TagGroup label="Career interests" tags={interests} setTags={setInterests} tone="blue" />
            <TagGroup label="Personal hobbies" tags={hobbies} setTags={setHobbies} tone="gold" />
          </section>
          <section className="rounded-2xl border-l-4 border-gold bg-accent/20 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-accent-foreground">✨ Fun Fact</p>
            <p className="mt-1 font-semibold">I once climbed Mount Kilimanjaro!</p>
          </section>
        </div>

        <section className="glass space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Your Career Roadmap</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Search RBC full-time roles…" className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              {focused && (
                <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                  {matches.length ? matches.map((r) => (
                    <li key={r.title}><button onMouseDown={() => { setTarget(r); setQuery(""); }} className="w-full px-4 py-2 text-left text-sm hover:bg-secondary">
                      <span className="font-semibold">{r.title}</span> <span className="text-xs text-muted-foreground">· {r.lob}</span></button></li>
                  )) : <li className="px-4 py-2 text-sm text-muted-foreground">No matching RBC role</li>}
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {nodes.map((n, i) => (
              <div key={n.label} className="flex flex-1 items-center gap-3">
                <button onClick={() => setDrawer(n.role)} className={`flex-1 rounded-2xl border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${i === 2 ? "border-gold bg-accent/15" : i === 0 ? "border-primary bg-secondary" : "border-border bg-card"}`}>
                  <p className="text-xs font-bold uppercase text-muted-foreground">{n.label}</p>
                  <p className="mt-1 font-bold leading-tight">{n.role.title}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress(n.role)}%` }} /></div>
                  <p className="mt-1 text-xs text-muted-foreground">{progress(n.role)}% skills complete · View details</p>
                </button>
                {i < 2 && <ArrowRight className="hidden h-5 w-5 shrink-0 text-primary md:block" />}
              </div>
            ))}
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Goals toward {target.title}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {target.skills.map((s) => {
                const k = target.title + s;
                return (
                  <button key={s} onClick={() => setDone({ ...done, [k]: !done[k] })} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-left text-sm">
                    <span className={`grid h-5 w-5 place-items-center rounded-md border ${done[k] ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{done[k] && <Check className="h-3 w-3" />}</span>{s}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Sparkles className="h-5 w-5 text-gold" /> AI Role Suggestions & LOB Explorer</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lobs.map((l) => { const I = lobIcons[l.name] ?? Briefcase; const on = lobFilter === l.name; return (
            <button key={l.name} onClick={() => setLobFilter(on ? null : l.name)} className={`glass p-5 text-left transition hover:-translate-y-0.5 ${on ? "ring-2 ring-primary" : ""}`}>
              <I className="h-6 w-6 text-primary" /><p className="mt-2 font-bold">{l.name}</p>
              <p className="text-sm text-muted-foreground">{l.blurb}</p><p className="mt-2 text-xs font-semibold text-primary">{l.openings} internal openings</p>
            </button>); })}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((r) => (
            <div key={r.title} className="glass flex flex-col gap-2 p-5">
              <span className="w-fit rounded-full bg-accent/30 px-2 py-0.5 text-xs font-bold">AI match</span>
              <p className="font-bold">{r.title}</p><p className="text-sm text-muted-foreground">{r.lob}</p>
              <div className="mt-auto flex gap-2 pt-2">
                <Button size="sm" onClick={() => { setTarget(r); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Set as target</Button>
                <Button size="sm" variant="outline" onClick={() => setDrawer(r)}>Details</Button>
              </div>
            </div>
          ))}
          {!suggestions.length && <p className="text-sm text-muted-foreground">No suggestions for this filter — try adding interests.</p>}
        </div>
      </section>

      <Sheet open={!!drawer} onOpenChange={(v) => !v && setDrawer(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {drawer && (<div className="space-y-5">
            <SheetHeader className="p-0"><SheetTitle className="text-2xl">{drawer.title}</SheetTitle><p className="text-sm text-muted-foreground">{drawer.lob}</p></SheetHeader>
            <Block title="Required skills" items={drawer.skills} icon={Check} />
            <Block title="Recommended RBC workshops" items={drawer.workshops} icon={GraduationCap} />
            <Block title="Learning resources" items={drawer.resources} icon={BookOpen} />
            <div>
              <h3 className="mb-2 font-bold">Mentors</h3>
              <div className="space-y-2">{drawer.mentors.map((m) => (
                <div key={m.name} className="glass flex items-center gap-3 p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-bold text-primary">{m.name.split(" ").map((x) => x[0]).join("")}</div>
                  <div className="flex-1"><p className="font-semibold">{m.name}</p><p className="text-xs text-muted-foreground">{m.area} · {m.years} yrs</p>
                    <span className="text-xs font-semibold text-primary">● Open to Mentoring/Networking</span></div>
                  <Button size="sm" onClick={() => toast.success(`Coffee chat requested with ${m.name}`)}><Coffee className="h-4 w-4" /> Request Coffee Chat</Button>
                </div>))}</div>
            </div>
          </div>)}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function Block({ title, items, icon: I }: { title: string; items: string[]; icon: typeof Check }) {
  return <div><h3 className="mb-2 font-bold">{title}</h3><ul className="space-y-1.5">{items.map((i) => <li key={i} className="flex items-center gap-2 text-sm"><I className="h-4 w-4 text-primary" />{i}</li>)}</ul></div>;
}

function TagGroup({ label, tags, setTags, tone }: { label: string; tags: string[]; setTags: (t: string[]) => void; tone: "blue" | "gold" }) {
  const [v, setV] = useState("");
  const add = () => { const t = v.trim(); if (t && !tags.includes(t)) setTags([...tags, t]); setV(""); };
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className={`group inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${tone === "blue" ? "bg-secondary text-secondary-foreground" : "bg-accent/30 text-accent-foreground"}`}>
            {t}<button aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}><X className="h-3 w-3 opacity-50 hover:opacity-100" /></button>
          </span>
        ))}
        <span className="inline-flex items-center rounded-full border border-dashed border-input pl-3">
          <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add tag" className="w-20 bg-transparent text-sm outline-none" />
          <button onClick={add} aria-label="Add tag" className="p-1.5 text-primary"><Plus className="h-4 w-4" /></button>
        </span>
      </div>
    </div>
  );
}
