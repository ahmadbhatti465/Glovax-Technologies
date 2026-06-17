"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { JobPosition } from "@/types";

const fallbackPositions: JobPosition[] = [
  {
    id: "1",
    title: "Senior AI/ML Engineer",
    department: "Engineering",
    location: "Remote / SF",
    type: "Full-time",
    experience: "5+ years",
    description: "",
    responsibilities: [],
    requirements: [],
  },
  {
    id: "2",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "",
    responsibilities: [],
    requirements: [],
  },
  {
    id: "3",
    title: "Product Manager",
    department: "Product",
    location: "San Francisco",
    type: "Full-time",
    experience: "4+ years",
    description: "",
    responsibilities: [],
    requirements: [],
  },
  {
    id: "4",
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote / SF",
    type: "Full-time",
    experience: "3+ years",
    description: "",
    responsibilities: [],
    requirements: [],
  },
  {
    id: "5",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "",
    responsibilities: [],
    requirements: [],
  },
  {
    id: "6",
    title: "AI Research Intern",
    department: "AI/ML",
    location: "San Francisco",
    type: "Internship",
    experience: "0-1 years",
    description: "",
    responsibilities: [],
    requirements: [],
  },
];

const benefits = [
  "Competitive salary & equity",
  "Remote-first culture",
  "Health, dental & vision",
  "Learning budget",
  "Flexible PTO",
  "Annual team retreats",
  "Home office stipend",
  "Parental leave",
];

export default function CareerContent() {
  const [positions, setPositions] = useState<JobPosition[]>(fallbackPositions);

  useEffect(() => {
    fetch("/api/public/careers")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPositions(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            eyebrow="Careers"
            title="Join our"
            titleHighlight="team"
            subtitle="We're always looking for exceptional people who are passionate about building great products."
          />

          <div className="mb-20">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Why work here
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="p-4 rounded-xl bg-surface border border-border text-sm text-muted-foreground"
                >
                  {benefit}
                </motion.div>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Open Positions ({positions.length})
          </h3>

          <div className="space-y-4">
            {positions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{position.title}</h4>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                        {position.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {position.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {position.experience}
                      </span>
                    </div>
                  </div>

                  <MagneticButton
                    href="/contact"
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:text-accent-hover whitespace-nowrap"
                  >
                    Apply Now
                    <ArrowUpRight className="w-4 h-4" />
                  </MagneticButton>
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
