import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Video, Clock, Target, Trophy, Medal, Check, Shuffle } from "lucide-react";
import { useStoredState } from "@/lib/use-stored-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buddy, connections, leaderboard } from "@/lib/spark-data";

export const Route = createFileRoute("/check-in")({
  head: () => ({
    meta: [
      { title: "Bi-Weekly Check-In — RBC Momentum" },
      { name: "description", content: "Meet your cross-functional buddy, share an anonymous bi-weekly check-in and play the RBC Momentum Connections game." },
      { property: "og:title", content: "Bi-Weekly Check-In — RBC Momentum" },
      { property: "og:description", content: "Bi-weekly check-in, buddy match and a collaborative Connections game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckIn,
});

const groupStyle: Record<string, string> = { gold: "bg-gold text-accent-foreground", blue: "bg-primary text-primary-foreground", sky: "bg-secondary text-secondary-foreground", red: "bg-rbc-red text-destructive-foreground" };

// Sessions run every second Friday; the check-in auto-submits at 4:25 PM local time.
const ANCHOR = new Date(2026, 10, 20, 16, 25).getTime();
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

function nextCutoff(now: number) {
  return ANCHOR + Math.max(0, Math.ceil((now - ANCHOR) / TWO_WEEKS)) * TWO_WEEKS;
}

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => { const now = Date.now(); setLeft(nextCutoff(now) - now); };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return "--:--:--";
  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400);
  const clock = [Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":");
  return d > 0 ? `${d}d ${clock}` : clock;
}

type Goal = { text: string; setAt: string };
const initialGoal: Goal = {
  text: "Book two coffee chats with Technology & Operations teams and finish the Python for Quants module.",
  setAt: new Date(2026, 10, 6, 16, 5).toISOString(),
};
const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });

function CheckIn() {
  const countdown = useCountdown();
  const [form, setForm] = useState({ a: "", b: "", c: "" });
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [goal, setGoal] = useStoredState<Goal>("momentum.goal", initialGoal);
  const fields = [
    { k: "a" as const, label: "One positive highlight from the past two weeks" },
    { k: "b" as const, label: "One area of improvement you’d like to see in your area" },
    { k: "c" as const, label: "One goal for the next two weeks" },
  ];
  const ready = form.a.trim() && form.b.trim() && form.c.trim();

  return (
    <main className="w-full space-y-6 px-6 py-8 lg:px-10">
      <section className="glass flex flex-wrap items-center gap-4 bg-welcome p-5">
        <div className="rounded-xl bg-primary px-4 py-2 font-display font-bold text-primary-foreground">FRIDAY | 4:00 PM – 4:20 PM</div>
        <div className="flex items-center gap-2 text-sm font-semibold"><Clock className="h-4 w-4 text-rbc-red" /> Auto-submits at 4:25 PM <span className="rounded-md bg-accent/30 px-2 font-mono">{finished ? "Submitted" : countdown}</span></div>
        <div className="flex gap-2 text-sm font-semibold">
          <span className="rounded-full bg-card px-3 py-1"><span className="text-primary">●</span> You: Joined</span>
          <span className="rounded-full bg-card px-3 py-1"><span className="text-primary">●</span> Partner: {submitted ? "Submitted ✓" : "Joined"}</span>
        </div>
        <Button className="ml-auto" onClick={() => window.open("https://teams.microsoft.com", "_blank")}><Video className="h-4 w-4" /> Join Virtual Meeting</Button>
      </section>

      <div className="grid gap-6 lg:grid-cols-[70fr_30fr]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <section className="glass p-5">
                <p className="text-xs font-bold uppercase text-muted-foreground">Your Match</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-gold text-lg font-bold text-accent-foreground ring-4 ring-secondary">{buddy.initials}</div>
                  <div><p className="text-lg font-bold">{buddy.name}</p><p className="text-sm text-muted-foreground">{buddy.area}</p></div>
                </div>
                <p className="mt-3 rounded-xl border-l-4 border-gold bg-accent/15 p-3 text-sm"><b>Fun Fact:</b> {buddy.funFact}</p>
                <div className="mt-3 flex flex-wrap gap-1">{buddy.shared.map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">Shared: {s}</span>)}</div>
              </section>
              <section className="glass p-5">
                <p className="flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground"><Target className="h-4 w-4" /> Your Bi-Weekly Goal</p>
                <p className="mt-2 font-semibold">"{goal.text}"</p>
                <p className="mt-1 text-xs text-muted-foreground">Set on {fmtDate(goal.setAt)}{submitted && " · updated from this check-in"}</p>
              </section>
            </div>
            <section className="glass space-y-4 p-5">
              <div><h2 className="text-xl font-bold">Bi-Weekly Check-In</h2><p className="text-sm text-muted-foreground">Fill these out individually while chatting with your buddy. Your responses are anonymous.</p></div>
              {fields.map((f) => (
                <label key={f.k} className="block space-y-1"><span className="text-sm font-semibold">{f.label}</span>
                  <Textarea rows={2} disabled={submitted} value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} /></label>
              ))}
              <Button className="w-full" size="lg" disabled={!ready || submitted} onClick={() => { setGoal({ text: form.c.trim(), setAt: new Date().toISOString() }); setSubmitted(true); }}>
                {submitted ? <><Check className="h-4 w-4" /> Submitted · Sarah: Submitted ✓</> : "Submit Check-In & Unlock Game"}
              </Button>
            </section>
          </div>

          <section className="glass relative overflow-hidden p-5">
            <Game locked={!submitted} finished={finished} onFinish={(s) => { setScore(s); setFinished(true); }} />
            {!submitted && (
              <div className="absolute inset-0 grid place-items-center bg-card/60 backdrop-blur-md">
                <div className="max-w-sm text-center"><Lock className="mx-auto h-12 w-12 text-gold" />
                  <p className="mt-3 font-semibold">Complete & submit your check-in forms to unlock today’s Connections game!</p></div>
              </div>
            )}
          </section>
        </div>

        <aside className="glass h-fit p-5 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Trophy className="h-5 w-5 text-gold" /> Bi-Weekly Leaderboard</h2>
          {!finished ? (
            <div className="mt-4 rounded-2xl bg-muted/70 p-6 text-center backdrop-blur">
              <Clock className="mx-auto h-8 w-8 animate-pulse text-primary" />
              <p className="mt-2 font-bold">Games in Progress</p>
              <p className="text-sm text-muted-foreground">Final Top 3 & Team Rankings unlock at 4:25 PM once all cohort games auto-submit.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
              {leaderboard.map((l) => (
                <div key={l.rank} className="flex items-center gap-3 rounded-xl bg-card p-3 shadow-sm">
                  <span className={`grid h-9 w-9 place-items-center rounded-full font-bold ${l.rank === 1 ? "bg-gold text-accent-foreground" : l.rank === 2 ? "bg-silver" : "bg-bronze text-primary-foreground"}`}><Medal className="h-4 w-4" /></span>
                  <div className="flex-1"><p className="text-sm font-bold">#{l.rank} {l.team}</p></div><span className="font-bold text-primary">{l.score}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="rounded-xl border-2 border-primary bg-secondary p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Your Team</p>
                  <p className="font-bold">#7 — You & Sarah Jenkins • {score} pts</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

function Game({ locked, finished, onFinish }: { locked: boolean; finished: boolean; onFinish: (score: number) => void }) {
  const [tiles, setTiles] = useState<string[]>(() => { const w: string[] = connections.flatMap((g) => [...g.words]); return [0,1,2,3].flatMap((i) => w.filter((_, j) => j % 4 === i)); });
  const [sel, setSel] = useState<string[]>([]);
  useEffect(() => { setTiles((t) => [...t].sort(() => 0.5 - Math.random())); }, []);
  const [solved, setSolved] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [msg, setMsg] = useState("");
  const score = 180 + solved.length * 50 - mistakes * 10;

  const submit = () => {
    const g = connections.find((c) => sel.every((w) => (c.words as readonly string[]).includes(w)));
    if (g) {
      const ns = [...solved, g.group]; setSolved(ns); setTiles(tiles.filter((t) => !sel.includes(t))); setSel([]); setMsg(`Nice! ${g.group}`);
      if (ns.length === 4) onFinish(180 + ns.length * 50 - mistakes * 10);
    } else { setMistakes(mistakes + 1); setMsg("Not quite — try again together!"); setSel([]); }
  };

  return (
    <div className={locked ? "pointer-events-none select-none" : ""} aria-hidden={locked}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div><h2 className="text-xl font-bold">RBC Momentum Connections</h2><p className="text-sm text-muted-foreground">Find four groups of four — play together for a team score.</p></div>
        <div className="text-right"><p className="text-sm font-semibold">Team score: <span className="text-primary">{Math.max(0, score)}</span></p><p className="text-xs text-muted-foreground">Mistakes: {mistakes}</p></div>
      </div>
      <div className="space-y-2">
        {solved.map((name) => { const g = connections.find((c) => c.group === name)!; return (
          <div key={name} className={`rounded-xl p-3 text-center ${groupStyle[g.color]}`}><p className="font-bold">{g.group}</p><p className="text-sm">{g.words.join(", ")}</p></div>); })}
        <div className="grid grid-cols-4 gap-2">
          {tiles.map((t) => { const on = sel.includes(t); return (
            <button key={t} disabled={finished} onClick={() => setSel(on ? sel.filter((x) => x !== t) : sel.length < 4 ? [...sel, t] : sel)}
              className={`h-16 rounded-xl text-xs font-bold tracking-wide transition sm:text-sm ${on ? "scale-95 bg-rbc-blue-deep text-primary-foreground" : "bg-muted hover:bg-secondary"}`}>{t}</button>); })}
        </div>
      </div>
      <p className="mt-3 h-5 text-center text-sm font-semibold text-primary">{msg}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button variant="outline" disabled={finished} onClick={() => setTiles([...tiles].sort(() => 0.5 - Math.random()))}><Shuffle className="h-4 w-4" /> Shuffle</Button>
        <Button variant="outline" disabled={finished || !sel.length} onClick={() => setSel([])}>Deselect</Button>
        <Button disabled={finished || sel.length !== 4} onClick={submit}>Submit Group</Button>
        <Button variant="secondary" disabled={finished} onClick={() => onFinish(Math.max(0, score))}>Finish & Submit Game Score</Button>
      </div>
    </div>
  );
}
