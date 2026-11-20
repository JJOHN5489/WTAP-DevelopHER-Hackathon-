import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, GraduationCap } from "lucide-react";
import { user } from "@/lib/spark-data";
import { useStoredState } from "@/lib/use-stored-state";
import { defaultInterests, defaultHobbies } from "@/lib/profile-defaults";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — RBC Momentum" },
      { name: "description", content: "Your RBC Momentum profile: interests, hobbies and fun fact." },
      { property: "og:title", content: "Home — RBC Momentum" },
      { property: "og:description", content: "Your RBC Momentum profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [interests, setInterests] = useStoredState("momentum.interests", defaultInterests);
  const [hobbies, setHobbies] = useStoredState("momentum.hobbies", defaultHobbies);

  return (
    <main className="w-full space-y-6 px-6 py-8 lg:px-10">
      <section className="glass bg-welcome flex flex-wrap items-center gap-5 p-6">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-4 ring-gold">{user.initials}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">Welcome back 👋</p>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.title}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground"><GraduationCap className="h-4 w-4" /> {user.school}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass space-y-4 p-5">
          <h2 className="font-bold">Interests & Hobbies</h2>
          <TagGroup label="Career interests" tags={interests} setTags={setInterests} tone="blue" />
          <TagGroup label="Personal hobbies" tags={hobbies} setTags={setHobbies} tone="gold" />
        </section>
        <section className="h-fit rounded-2xl border-l-4 border-gold bg-accent/20 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-accent-foreground">✨ Fun Fact</p>
          <p className="mt-1 font-semibold">{user.funFact}</p>
        </section>
      </div>
    </main>
  );
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
