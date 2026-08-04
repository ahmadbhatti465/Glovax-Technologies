"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Store, MapPin, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/directory/ListingCard";
import { Business } from "@/types";
import { businesses as fallbackBusinesses } from "@/data/businesses";

interface DirectoryContentProps {
  businesses?: Business[];
}

export default function DirectoryContent({
  businesses: serverBusinesses,
}: DirectoryContentProps) {
  const all = serverBusinesses?.length ? serverBusinesses : fallbackBusinesses;

  const categories = useMemo(
    () => [...new Set(all.map((b) => b.category))].sort(),
    [all]
  );
  const countries = useMemo(
    () => new Set(all.map((b) => b.country)).size,
    [all]
  );

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((b) => {
      if (activeCategory !== "All" && b.category !== activeCategory) return false;
      if (!q) return true;
      return [b.name, b.category, b.city, b.shortDescription, ...b.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [all, query, activeCategory]);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden noise-overlay">
          <div className="absolute inset-0 grid-pattern z-[1]" />
          <div className="absolute inset-0 gradient-brand opacity-30 z-0" />
          <div
            className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--teal) 15%, transparent) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass text-xs md:text-sm font-medium text-muted tracking-wide">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </span>
                Glovax Directory
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] max-w-3xl">
              Businesses we&apos;ve helped
              <br />
              <span className="teal-shimmer">get online.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted max-w-2xl leading-relaxed">
              Browse the companies behind the products we build — from e-commerce
              stores to cloud consultancies. Find trusted businesses by category
              or search for what you need.
            </p>

            {/* Stats row */}
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <Stat value={all.length} label="Listings" />
              <Stat value={categories.length} label="Categories" />
              <Stat value={countries} label="Countries" />
            </div>
          </div>
        </section>

        {/* Filter + grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses, tags, or cities…"
              aria-label="Search the directory"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-surface-raised border border-neutral-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal/40 transition-colors"
            />
          </div>

          {/* Category chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {["All", ...categories].map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-deep to-teal text-accent-foreground border-transparent shadow-[0_0_20px_var(--teal-glow)]"
                      : "bg-surface-raised border-neutral-border text-muted-foreground hover:text-teal hover:border-teal/40"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="mt-10 mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="text-foreground font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "business" : "businesses"}
            </p>
            {(query || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((business, index) => (
                <ListingCard key={business.id} business={business} index={index} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-raised border border-neutral-border mb-6">
                <Store className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No businesses found</h2>
              <p className="text-muted max-w-md mx-auto mb-8">
                Try adjusting your search or category filter — or check back soon
                as new listings are added.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-deep to-teal text-accent-foreground font-semibold hover:brightness-110 transition-all"
              >
                <MapPin className="w-4 h-4" /> View all businesses
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold tracking-tight text-accent">
        {value}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
