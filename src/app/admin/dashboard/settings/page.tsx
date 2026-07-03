"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface ContentItem {
  key: string;
  value: unknown;
}

const defaultContent: Record<string, unknown> = {
  stats: [
    { value: 100, suffix: "+", label: "Projects Delivered" },
    { value: 99, suffix: "%", label: "Client Satisfaction" },
    { value: 30, suffix: "+", label: "Countries Served" },
    { value: 35, suffix: "+", label: "Team Members" },
  ],
  process_steps: [
    { number: "01", title: "Discover", description: "We dive deep into your business, users, and goals through research and stakeholder interviews to build a solid foundation.", icon: "Search" },
    { number: "02", title: "Design", description: "We craft intuitive, beautiful interfaces and system architectures that solve real problems and delight users.", icon: "PenTool" },
    { number: "03", title: "Develop", description: "We build with clean, scalable code using modern frameworks and best practices for performance and maintainability.", icon: "Code" },
    { number: "04", title: "Deliver", description: "We deploy, monitor, and optimize your product with CI/CD pipelines, ensuring long-term success and growth.", icon: "Rocket" },
  ],
  client_logos: ["TechStart", "InnovateLabs", "GrowthCo", "GlobalTech", "DigitalFirst", "AppVenture", "CloudNine", "FutureSoft", "DataPulse", "NexGen AI"],
  cta_banner: {
    eyebrow: "Let's Collaborate",
    title: "Ready to build",
    titleHighlight: "something great?",
    subtitle: "Let's discuss your project and explore how Glovax Technologies can help you achieve your business goals with cutting-edge technology.",
    buttons: [
      { label: "Start a Project", href: "/contact", variant: "primary" },
      { label: "Book a Call", href: "https://calendly.com/glovaxtechnologies/30min", variant: "outline" },
      { label: "Explore Services", href: "/services", variant: "ghost" },
    ],
  },
  about: {
    heroEyebrow: "About Us",
    heroTitle: "Building the future,",
    heroTitleHighlight: "one product at a time.",
    heroSubtitle:
      "Glovax Technologies was founded with a simple mission: to help businesses leverage technology to create meaningful impact. Today, we're a global team of engineers, designers, and strategists who believe that great software can change the world.",
    stats: [
      { value: 100, suffix: "+", label: "Projects" },
      { value: 99, suffix: "%", label: "Satisfaction" },
      { value: 30, suffix: "+", label: "Countries" },
      { value: 35, suffix: "+", label: "Team" },
    ],
    values: [
      { icon: "Target", title: "Results First", description: "We measure success by the tangible business outcomes we deliver, not just lines of code shipped." },
      { icon: "Shield", title: "Quality Obsessed", description: "Every pixel, every interaction, every line of code is crafted with precision and pride." },
      { icon: "Zap", title: "Move Fast", description: "We combine agility with rigor to ship faster without sacrificing quality or security." },
      { icon: "Users", title: "True Partners", description: "We're not vendors we're an extension of your team, invested in your long-term success." },
      { icon: "Globe", title: "Global Mindset", description: "We build products that work everywhere, for everyone, respecting diverse users and markets." },
      { icon: "Heart", title: "Craft with Care", description: "We love what we do, and it shows in the attention and thoughtfulness we bring to every project." },
    ],
    timeline: [
      { year: "2018", event: "Founded in San Francisco" },
      { year: "2019", event: "First 50 clients" },
      { year: "2020", event: "Expanded to mobile development" },
      { year: "2021", event: "AI & ML practice launched" },
      { year: "2022", event: "100+ projects delivered" },
      { year: "2023", event: "Global expansion 30+ countries" },
      { year: "2024", event: "50+ team members" },
      { year: "2025", event: "Industry recognition & awards" },
    ],
  },
  career_benefits: [
    "Competitive salary & equity",
    "Remote-first culture",
    "Health, dental & vision",
    "Learning budget",
    "Flexible PTO",
    "Annual team retreats",
    "Home office stipend",
    "Parental leave",
  ],
};

export default function SettingsPage() {
  const { loading } = useAuth(true);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [activeKey, setActiveKey] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ContentItem[]) => {
        const map = new Map(data.map((d) => [d.key, d]));
        const merged = Object.keys(defaultContent).map((key) => ({
          key,
          value: map.get(key)?.value ?? defaultContent[key],
        }));
        setItems(merged);
      })
      .catch(() => {
        setItems(Object.keys(defaultContent).map((key) => ({ key, value: defaultContent[key] })));
      });
  }, []);

  const activeItem = items.find((i) => i.key === activeKey);

  const updateValue = (val: unknown) => {
    setItems((prev) => prev.map((i) => (i.key === activeKey ? { ...i, value: val } : i)));
  };

  const saveActive = async () => {
    if (!activeItem) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: activeItem.key, value: activeItem.value }),
      });
      if (res.ok) {
        setMessage("Saved successfully");
      } else {
        setMessage("Failed to save");
      }
    } catch {
      setMessage("Failed to save");
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a]" />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="border-b border-[#C8A45E]/20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#C8A45E]" />
            <span className="font-semibold">Glovax Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-sm text-gray-400 hover:text-white">
              Dashboard
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin";
              }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Site Settings</h1>
        <p className="text-gray-400 text-sm mb-8">Manage global content shown across the website</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveKey(item.key)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeKey === item.key
                    ? "bg-[#C8A45E]/10 text-[#C8A45E] border border-[#C8A45E]/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="lg:col-span-3">
            {activeItem && (
              <div className="bg-[#111111] border border-[#C8A45E]/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">
                    {activeItem.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h2>
                  <div className="flex items-center gap-3">
                    {message && (
                      <span
                        className={`text-xs ${
                          message.includes("success") ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {message}
                      </span>
                    )}
                    <button
                      onClick={saveActive}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#C8A45E] text-black text-sm font-medium rounded-lg hover:bg-[#B8944E] transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                <ContentEditor
                  key={activeItem.key}
                  value={activeItem.value}
                  onChange={updateValue}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ContentEditor({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  if (typeof value === "string") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#C8A45E]/50 focus:outline-none"
        rows={6}
      />
    );
  }

  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "string") {
      return (
        <div className="space-y-2">
          {(value as string[]).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const arr = [...(value as string[])];
                  arr[index] = e.target.value;
                  onChange(arr);
                }}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#C8A45E]/50 focus:outline-none"
              />
              <button
                onClick={() => {
                  const arr = [...(value as string[])];
                  arr.splice(index, 1);
                  onChange(arr);
                }}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...(value as string[]), ""])}
            className="flex items-center gap-2 text-sm text-[#C8A45E] hover:text-[#B8944E] mt-2"
          >
            <Plus className="w-4 h-4" />
            Add item
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {(value as Record<string, unknown>[]).map((item, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4 relative">
            <button
              onClick={() => {
                const arr = [...(value as Record<string, unknown>[])];
                arr.splice(index, 1);
                onChange(arr);
              }}
              className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <ObjectEditor
              value={item}
              onChange={(val) => {
                const arr = [...(value as Record<string, unknown>[])];
                arr[index] = val;
                onChange(arr);
              }}
            />
          </div>
        ))}
        <button
          onClick={() => {
            const sample = value.length > 0 ? { ...(value as Record<string, unknown>[])[0] } : {};
            Object.keys(sample).forEach((k) => (sample[k] = ""));
            onChange([...(value as Record<string, unknown>[]), sample]);
          }}
          className="flex items-center gap-2 text-sm text-[#C8A45E] hover:text-[#B8944E] mt-2"
        >
          <Plus className="w-4 h-4" />
          Add item
        </button>
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <ObjectEditor
        value={value as Record<string, unknown>}
        onChange={onChange}
      />
    );
  }

  return <div className="text-gray-400 text-sm">Unsupported content type</div>;
}

function ObjectEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(value).map(([key, val]) => (
        <div key={key}>
          <label className="block text-xs text-gray-400 mb-1 capitalize">{key.replace(/_/g, " ")}</label>
          {typeof val === "string" && (
            <input
              type="text"
              value={val}
              onChange={(e) => onChange({ ...value, [key]: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#C8A45E]/50 focus:outline-none"
            />
          )}
          {typeof val === "number" && (
            <input
              type="number"
              value={val}
              onChange={(e) => onChange({ ...value, [key]: Number(e.target.value) })}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#C8A45E]/50 focus:outline-none"
            />
          )}
          {typeof val === "boolean" && (
            <input
              type="checkbox"
              checked={val}
              onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
              className="w-5 h-5 accent-[#C8A45E]"
            />
          )}
          {Array.isArray(val) && (
            <ContentEditor value={val} onChange={(v) => onChange({ ...value, [key]: v })} />
          )}
          {typeof val === "object" && val !== null && !Array.isArray(val) && (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3 mt-1">
              <ObjectEditor
                value={val as Record<string, unknown>}
                onChange={(v) => onChange({ ...value, [key]: v })}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
