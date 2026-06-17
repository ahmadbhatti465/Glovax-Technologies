"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TeamMember } from "@/types";

const fallbackTeam: TeamMember[] = [
  {
    id: "1",
    name: "Ahmad",
    role: "Founder & CEO",
    department: "Executive",
    bio: "Visionary leader with 10+ years in software development and digital transformation.",
    expertise: [],
  },
  {
    id: "2",
    name: "Iqra Kiran",
    role: "Chief Technology Officer",
    department: "Engineering",
    bio: "Former Google lead architect specializing in scalable AI systems and cloud infrastructure.",
    expertise: [],
  },
  {
    id: "3",
    name: "Ali Mohyudin",
    role: "Head of AI Research",
    department: "AI/ML",
    bio: "PhD in Machine Learning with deep expertise in neural networks and deep learning.",
    expertise: [],
  },
  {
    id: "4",
    name: "Moaaz Shafqat",
    role: "Lead Developer",
    department: "Engineering",
    bio: "Full-stack expert passionate about building elegant, performant web applications.",
    expertise: [],
  },
  {
    id: "5",
    name: "Hammad Shafqat",
    role: "Head of Marketing",
    department: "Marketing",
    bio: "Growth hacker with a track record of scaling startups from 0 to $10M+ revenue.",
    expertise: [],
  },
  {
    id: "6",
    name: "Rubab Mehmood",
    role: "Client Success Director",
    department: "Client Success",
    bio: "Dedicated to ensuring every client achieves their business goals with our solutions.",
    expertise: [],
  },
];

export default function TeamContent() {
  const [team, setTeam] = useState<TeamMember[]>(fallbackTeam);

  useEffect(() => {
    fetch("/api/public/team")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTeam(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            eyebrow="Our Team"
            title="Meet the minds behind"
            titleHighlight="Glovax Technologies"
            subtitle="A diverse team of innovators, engineers, and problem-solvers dedicated to transforming businesses through technology."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
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
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
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
