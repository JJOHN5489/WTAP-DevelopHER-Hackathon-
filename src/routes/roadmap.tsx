import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles, Coffee, Check, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { roles, suggestionMap, type Role } from "@/lib/spark-data";
import { useStoredState } from "@/lib/use-stored-state";
import { defaultInterests, defaultHobbies } from "@/lib/profile-defaults";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Career Roadmap — RBC Momentum" },
      { name: "description", content: "Plan your path from intern to target RBC role with mentors, workshops and AI role suggestions." },
      { property: "og:title", content: "Career Roadmap — RBC Momentum" },
      { property: "og:description", content: "Plan your path to a full-time RBC role with mentors and workshops." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Roadmap,
});

const currentRole: Role = {
  title: "Early Talent Intern", lob: "Capital Markets", intermediate: "",
  skills: ["Excel & financial modelling", "Team communication", "Market fundamentals"],
  workshops: ["Intern Onboarding Week", "Capital Markets 101"], resources: ["Intern Hub on RBC Connect"],
  mentors: [{ name: "Sarah Jenkins", years: 2, area: "RBC Capital Markets" }],
};

function Roadmap() {
  const [interests] = useStoredState("momentum.interests", defaultInterests);
  const [hobbies] = useStoredState("momentum.hobbies", defaultHobbies);
  const [target, setTarget] = useState<Role>(roles[0]!);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [drawer, setDrawer] = useState<Role | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const matches = roles.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  const intermediate: Role = { ...target, title: target.intermediate, skills: target.skills.slice(0, 2), mentors: target.mentors.slice(0, 1) };
  const nodes = [{ label: "Current Role", role: currentRole }, { label: "Intermediate Step", role: intermediate }, { label: "Target Role", role: target }];

  const suggestions = useMemo(() => {
    const titles = new Set([...interests, ...hobbies].flatMap((t) => suggestionMap[t] ?? []));
    return roles.filter((r) => titles.has(r.title));
  }, [interests, hobbies]);

  const progress = (r: Role) => { const n = r.skills.filter((s) => done[r.title + s]).length; return Math.round((n / r.skills.length) * 100); };

  return (
    <main className="w-full space-y-6 px-6 py-8 lg:px-10">
      <section className="glass space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Your Career Roadmap</h1>
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

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Sparkles className="h-5 w-5 text-gold" /> AI Role Suggestions & Mentorship</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {suggestions.map((r) => {
            const mentor = r.mentors[0];
            return (
              <div key={r.title} className="glass flex flex-col gap-2 p-5">
                <span className="w-fit rounded-full bg-accent/30 px-2 py-0.5 text-xs font-bold">AI match</span>
                <p className="font-bold">{r.title}</p><p className="text-sm text-muted-foreground">{r.lob}</p>
                {mentor && <p className="text-xs text-muted-foreground"><span className="font-semibold text-primary">● Open to mentoring:</span> {mentor.name} · {mentor.area}</p>}
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => { setTarget(r); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Set as target</Button>
                  <Button size="sm" variant="outline" onClick={() => setDrawer(r)}>Details</Button>
                  {mentor && <Button size="sm" variant="outline" onClick={() => toast.success(`Coffee chat requested with ${mentor.name}`)}><Coffee className="h-4 w-4" /> Coffee chat</Button>}
                </div>
              </div>
            );
          })}
          {!suggestions.length && <p className="text-sm text-muted-foreground">No suggestions yet — add interests on your Home page.</p>}
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
