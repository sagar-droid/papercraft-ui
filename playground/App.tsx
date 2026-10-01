import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StickyNote } from "@/components/ui/sticky-note";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const THEMES = [
  { id: "", label: "Parchment" },
  { id: "paper-copy", label: "Copy paper" },
  { id: "paper-blueprint", label: "Blueprint" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-typewriter text-xs font-bold tracking-widest text-ink-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

export function App() {
  const [theme, setTheme] = useState(() => new URLSearchParams(location.search).get("theme") ?? "");

  return (
    <div className={`${theme} min-h-screen bg-desk paper-dots text-ink`}>
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-typewriter text-4xl font-bold tracking-tight ink-bleed">Papercraft UI</h1>
            <p className="mt-2 font-editorial text-lg text-ink-muted">Stationery for the web. Tailwind, clsx & tailwind-merge.</p>
          </div>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <Button key={t.id} size="sm" variant={theme === t.id ? "ink" : "default"} onClick={() => setTheme(t.id)}>
                {t.label}
              </Button>
            ))}
          </div>
        </header>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Cardstock</Button>
            <Button variant="ink">Ink stamp</Button>
            <Button variant="destructive">Shred</Button>
            <Button variant="perforated">Tear here</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Footnote link</Button>
            <Button disabled>Disabled</Button>
            <Button className="border-red-700 bg-amber-100 font-serif text-red-950 shadow-[4px_4px_0px_0px_#b91c1c]">
              Overridden via className
            </Button>
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap items-center gap-4">
            <Badge>Manila</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="danger">Void</Badge>
            <Badge variant="info">Verified</Badge>
            <Badge variant="highlight">Highlighted</Badge>
            <Badge shape="pill">3 clips</Badge>
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-8 md:grid-cols-3">
            <Card accent="tape">
              <CardHeader>
                <CardTitle>Field notes</CardTitle>
                <CardDescription>Taped into the journal.</CardDescription>
              </CardHeader>
              <CardContent>Hard-offset shadows stand in for depth — cardstock stacked flat on a desk.</CardContent>
              <CardFooter>
                <Button size="sm">Open</Button>
                <Button size="sm" variant="ghost">Archive</Button>
              </CardFooter>
            </Card>
            <Card texture="grid" accent="dog-ear" elevation="lg">
              <CardHeader>
                <CardTitle>Graph paper</CardTitle>
                <CardDescription>Dog-eared, lifted higher.</CardDescription>
              </CardHeader>
              <CardContent>Textures are plain utilities: paper-dots, paper-ruled, paper-grid, paper-grain.</CardContent>
            </Card>
            <Card texture="grain" elevation="sm">
              <CardHeader>
                <CardTitle>Grain</CardTitle>
                <CardDescription>Fibrous SVG noise.</CardDescription>
              </CardHeader>
              <CardContent>
                Mark the <mark className="bg-highlight px-0.5 text-ink">important bit</mark> with highlighter wax.
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Forms">
          <Card className="max-w-xl">
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Correspondent</Label>
                <Input id="name" placeholder="Ada Lovelace" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ref">Reference no.</Label>
                <Input id="ref" variant="underline" placeholder="No. ____" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bad">Postcode</Label>
                <Input id="bad" aria-invalid defaultValue="ZZZ" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="letter">Letter</Label>
                <Textarea id="letter" variant="ruled" rows={5} placeholder="Dear friend," />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="seal" defaultChecked />
                <Label htmlFor="seal" className="normal-case tracking-normal text-ink">Seal with wax</Label>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section title="Tabs">
          <Tabs defaultValue="drafts" className="max-w-xl">
            <TabsList>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="archive">Archive</TabsTrigger>
            </TabsList>
            <TabsContent value="drafts" className="font-editorial">Three unsent letters in the drawer.</TabsContent>
            <TabsContent value="sent" className="font-editorial">Posted Tuesday, first class.</TabsContent>
            <TabsContent value="archive" className="font-editorial">Filed under “miscellany”.</TabsContent>
          </Tabs>
        </Section>

        <Section title="Alerts & separators">
          <div className="flex max-w-xl flex-col gap-4">
            <Alert>
              <AlertTitle>Memo</AlertTitle>
              <AlertDescription>Meeting moved to the reading room.</AlertDescription>
            </Alert>
            <Alert variant="info">
              <AlertTitle>Verified</AlertTitle>
              <AlertDescription>Signature matches the ledger.</AlertDescription>
            </Alert>
            <Alert variant="danger">
              <AlertTitle>Returned to sender</AlertTitle>
              <AlertDescription>Insufficient postage.</AlertDescription>
            </Alert>
            <Separator />
            <Separator variant="double" />
          </div>
        </Section>

        <Section title="Sticky notes">
          <div className="flex flex-wrap gap-8 pt-4">
            <StickyNote taped>Buy stamps.</StickyNote>
            <StickyNote color="pink" tilt="right">Call the printer re: proofs.</StickyNote>
            <StickyNote color="blue" tilt="none">Blueprint review, 3pm.</StickyNote>
            <StickyNote color="green" className="torn-edge pb-6">Torn from the pad.</StickyNote>
          </div>
        </Section>
      </main>
    </div>
  );
}
