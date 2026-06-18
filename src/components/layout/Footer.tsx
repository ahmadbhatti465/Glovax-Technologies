"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig, footerLinks } from "@/lib/constants";
import { ArrowUpRight, Linkedin, Twitter, Instagram, Github } from "lucide-react";
import Image from "next/image";

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* Gold gradient top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,160,23,0.4) 30%, rgba(245,200,66,0.5) 50%, rgba(212,160,23,0.4) 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Footer Content */}
        <div className="py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <Link href="/" className="flex items-center group">
              <Image
                src="/images/glovax-logo.svg"
                alt="Glovax Technologies"
                width={160}
                height={56}
                className="h-10 w-auto transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(212,160,23,0.4)]"
              />
            </Link>
            <p className="mt-5 text-muted text-sm leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex items-center gap-3">
              {Object.entries(siteConfig.social).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-accent hover:border-[#D4A017]/20 hover:shadow-[0_0_15px_rgba(212,160,23,0.1)] transition-all duration-300"
                  aria-label={`Follow us on ${key}`}
                >
                  {socialIcons[key.toLowerCase()] || key}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide">Company</h4>
              <ul className="space-y-3.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-0.5 group-hover:translate-y-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide">Services</h4>
              <ul className="space-y-3.5">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-0.5 group-hover:translate-y-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide">Resources</h4>
              <ul className="space-y-3.5">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-0.5 group-hover:translate-y-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide">Contact</h4>
            <div className="space-y-3.5 text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="block text-muted-foreground hover:text-accent transition-colors duration-300"
              >
                {siteConfig.phone}
              </a>
              <p className="text-muted-foreground leading-relaxed">{siteConfig.address}</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
