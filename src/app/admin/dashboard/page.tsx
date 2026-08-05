"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  Briefcase,
  FolderOpen,
  MessageSquare,
  Users,
  Newspaper,
  Rocket,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const cards = [
  { label: "Services", href: "/admin/dashboard/services", icon: Rocket, color: "#1EDAC6" },
  { label: "Portfolio", href: "/admin/dashboard/portfolio", icon: FolderOpen, color: "#1EDAC6" },
  { label: "Testimonials", href: "/admin/dashboard/testimonials", icon: MessageSquare, color: "#1EDAC6" },
  { label: "Team", href: "/admin/dashboard/team", icon: Users, color: "#1EDAC6" },
  { label: "Blog", href: "/admin/dashboard/blog", icon: Newspaper, color: "#1EDAC6" },
  { label: "Careers", href: "/admin/dashboard/careers", icon: Briefcase, color: "#1EDAC6" },
  { label: "Settings", href: "/admin/dashboard/settings", icon: Settings, color: "#1EDAC6" },
];

export default function AdminDashboard() {
  const { loading } = useAuth(true);
  if (loading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="border-b border-[#1EDAC6]/20 bg-surface-raised">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#1EDAC6]" />
            <span className="font-semibold">Glovax Admin</span>
          </div>
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
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 text-sm mb-8">Manage your website content</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="group bg-surface-raised border border-[#1EDAC6]/10 hover:border-[#1EDAC6]/40 rounded-xl p-6 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-10"
                  style={{ backgroundColor: `${color}1a` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[#1EDAC6] transition-colors">
                    {label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Manage {label.toLowerCase()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
