"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { motion } from "framer-motion";
import { Target, Shield, Zap, Users, Globe, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Results First",
    description:
      "We measure success by the tangible business outcomes we deliver, not just lines of code shipped.",
  },
  {
    icon: Shield,
    title: "Quality Obsessed",
    description:
      "Every pixel, every interaction, every line of code is crafted with precision and pride.",
  },
  {
    icon: Zap,
    title: "Move Fast",
    description:
      "We combine agility with rigor to ship faster without sacrificing quality or security.",
  },
  {
    icon: Users,
    title: "True Partners",
    description:
      "We're not vendors — we're an extension of your team, invested in your long-term success.",
  },
  {
    icon: Globe,
    title: "Global Mindset",
    description:
      "We build products that work everywhere, for everyone, respecting diverse users and markets.",
  },
  {
    icon: Heart,
    title: "Craft with Care",
    description:
      "We love what we do, and it shows in the attention and thoughtfulness we bring to every project.",
  },
];

const timeline = [
  { year: "2018", event: "Founded in San Francisco" },
  { year: "2019", event: "First 50 clients" },
  { year: "2020", event: "Expanded to mobile development" },
  { year: "2021", event: "AI & ML practice launched" },
  { year: "2022", event: "100+ projects delivered" },
  { year: "2023", event: "Global expansion — 30+ countries" },
  { year: "2024", event: "50+ team members" },
  { year: "2025", event: "Industry recognition & awards" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mb-20"
          >
            <span className="text-accent text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Building the future,
              <span className="gradient-text"> one product at a time.</span>
            </h1>
            <p className="text-muted text-lg leading-relaxed">
              AhmadSols was founded with a simple mission: to help businesses
              leverage technology to create meaningful impact. Today, we're a
              global team of engineers, designers, and strategists who believe
              that great software can change the world.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-border mb-20">
            {[
              { value: 500, suffix: "+", label: "Projects" },
              { value: 98, suffix: "%", label: "Satisfaction" },
              { value: 30, suffix: "+", label: "Countries" },
              { value: 50, suffix: "+", label: "Team" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <SectionHeader
            eyebrow="Our Values"
            title="What we"
            titleHighlight="believe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="p-6 rounded-2xl bg-surface border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <SectionHeader
            eyebrow="Our Journey"
            title="How we got"
            titleHighlight="here"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative p-5 rounded-xl bg-surface border border-border"
              >
                <span className="text-accent text-sm font-semibold">
                  {item.year}
                </span>
                <p className="mt-1 text-sm text-foreground">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
