import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, BadgeCheck, Globe } from "lucide-react";
import { Business } from "@/types";

interface ListingCardProps {
  business: Business;
  index?: number;
}

export function ListingCard({ business, index = 0 }: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-3xl bg-surface-raised border border-neutral-border hover:border-teal/40 transition-all duration-500 overflow-hidden"
    >
      <Link href={`/directory/${business.slug}`} className="block p-6 md:p-7">
        {/* Header: image or monogram tile */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface border border-border mb-5">
          {business.image ? (
            <Image
              src={business.image}
              alt={business.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-deep/40 via-surface to-surface flex items-center justify-center">
              <span className="text-5xl font-bold text-teal/50 group-hover:text-teal/70 transition-colors duration-500">
                {business.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Category chip */}
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full border border-neutral-border">
            {business.category}
          </span>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {business.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-teal text-accent-foreground rounded-full">
                <BadgeCheck className="w-3 h-3" /> Featured
              </span>
            )}
            {business.isRemote && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-background/80 backdrop-blur-sm rounded-full border border-teal/40 text-teal">
                <Globe className="w-3 h-3" /> Remote
              </span>
            )}
          </div>
        </div>

        <h2 className="text-lg md:text-xl font-semibold tracking-tight group-hover:text-accent transition-colors duration-300">
          {business.name}
        </h2>

        {/* Rating + location */}
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{business.rating.toFixed(1)}</span>
            <span>({business.reviewCount})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {business.city}
            {business.isRemote ? " · Remote" : ""}
          </span>
        </div>

        <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-2">
          {business.shortDescription}
        </p>
      </Link>
    </motion.div>
  );
}
