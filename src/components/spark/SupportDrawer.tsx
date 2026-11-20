import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Compass, Users, CheckCircle2, ShieldCheck } from "lucide-react";
import { useSupport } from "./support-context";
import { user } from "@/lib/spark-data";

const cats = [
  { id: "urgent", icon: AlertTriangle, title: "Urgent Support / At-Risk Flag", desc: "Immediate attention for workplace or onboarding challenges." },
  { id: "mobility", icon: Compass, title: "Internal Mobility / Career Pivot", desc: "Explore transitions to other RBC departments." },
  { id: "mentor", icon: Users, title: "Mentorship Request", desc: "Request a 1-on-1 match with a full-time mentor." },
];

export function SupportDrawer() {
  const { open, setOpen } = useSupport();
  const [anon, setAnon] = useState(false);
  const [cat, setCat] = useState("mobility");
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const close = (v: boolean) => { setOpen(v); if (!v) setTimeout(() => { setDone(false); setText(""); }, 300); };

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center animate-in fade-in zoom-in-95">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <h2 className="text-2xl font-bold">Request received</h2>
            <p className="text-muted-foreground">{anon ? "Your anonymous note was routed to the Early Talent Program team." : "Your Early Talent Program Lead will reach out directly."}</p>
            <div className="glass w-full p-5 text-left">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Assigned Lead</p>
              <p className="text-lg font-bold">Jasmine Nguyen</p>
              <p className="text-sm text-primary">earlytalent.program@rbc.com</p>
              <div className="mt-3 rounded-lg bg-accent/30 p-3 text-sm font-semibold">Follow-up within 24–48 hours</div>
            </div>
            <Button onClick={() => close(false)}>Close</Button>
          </div>
        ) : (
          <div className="space-y-5">
            <SheetHeader className="p-0">
              <SheetTitle className="text-2xl">Support & Career Connect</SheetTitle>
              <SheetDescription>Reach the Early Talent Program team confidentially.</SheetDescription>
            </SheetHeader>
            <div className="glass flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{anon ? "Anonymous" : "Non-Anonymous"}</p>
                <p className="text-xs text-muted-foreground">{anon ? "Identity hidden • routed to Early Talent team" : "Auto-filled for direct 1-on-1 follow-up"}</p>
              </div>
              <Switch checked={anon} onCheckedChange={setAnon} aria-label="Anonymous" />
            </div>
            {anon ? (
              <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground"><ShieldCheck className="h-4 w-4" /> Your name, email and business area will not be shared.</div>
            ) : (
              <div className="grid gap-2">
                <Input readOnly value={user.name} /><Input readOnly value={user.email} /><Input readOnly value={user.area} />
              </div>
            )}
            <div className="grid gap-2">
              {cats.map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} className={`flex gap-3 rounded-2xl border-2 p-4 text-left transition ${cat === c.id ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/40"}`}>
                  <c.icon className={`mt-0.5 h-5 w-5 shrink-0 ${c.id === "urgent" ? "text-rbc-red" : "text-primary"}`} />
                  <span><span className="block font-semibold">{c.title}</span><span className="text-sm text-muted-foreground">{c.desc}</span></span>
                </button>
              ))}
            </div>
            <Textarea rows={4} placeholder="Share any context that will help us support you…" value={text} onChange={(e) => setText(e.target.value)} />
            <Button className="w-full" size="lg" disabled={!text.trim()} onClick={() => setDone(true)}>Submit</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
