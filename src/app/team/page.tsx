"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";

const team = [
  {
    name: "Ahmad",
    role: "Founder & CEO",
    bio: "Visionary leader with 15+ years in software development and digital transformation.",
    initials: "A",
  },
  {
    name: "Sarah Johnson",
    role: "Chief Technology Officer",
    bio: "Former Google lead architect specializing in scalable AI systems and cloud infrastructure.",
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Head of AI Research",
    bio: "PhD in Machine Learning with deep expertise in neural networks and deep learning.",
    initials: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Lead Developer",
    bio: "Full-stack expert passionate about building elegant, performant web applications.",
    initials: "ER",
  },
  {
    name: "David Kim",
    role: "Head of Marketing",
    bio: "Growth hacker with a track record of scaling startups from 0 to $10M+ revenue.",
    initials: "DK",
  },
  {
    name: "Lisa Thompson",
    role: "Client Success Director",
    bio: "Dedicated to ensuring every client achieves their business goals with our solutions.",
    initials: "LT",
  },
];

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            eyebrow="Our Team"
            title="Meet the minds behind"
            titleHighlight="AhmadSols"
            subtitle="A diverse team of innovators, engineers, and problem-solvers dedicated to transforming businesses through technology."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-accent mb-2">{member.role}</p>
                    <p className="text-sm text-muted leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
