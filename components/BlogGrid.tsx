"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function BlogGrid({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-white/50 text-center py-20 border border-white/5 rounded-2xl">
        No posts published yet. Check back soon.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {posts.map((post) => (
        <motion.div
          key={post.slug}
          variants={cardVariants}
          whileHover={{
            y: -4,
            boxShadow: "0 8px 40px rgba(108,99,255,0.15)",
          }}
          className="group flex flex-col bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer"
        >
          {/* Top Image */}
          <div className="relative w-full aspect-video overflow-hidden">
            {post.mainImage ? (
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.mainImage.alt || post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-white/5" />
            )}
            {/* Violet gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#6C63FF]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Body */}
          <div className="p-[20px] flex flex-col flex-grow">
            <div className="text-[13px] text-white/50 mb-3 flex justify-between items-center">
              <span>{post.author || "Avalence Team"}</span>
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            
            <h3 className="text-[18px] font-bold text-white mb-2 line-clamp-2 leading-tight">
              {post.title}
            </h3>
            
            <p className="text-[14px] text-text-muted mb-6 line-clamp-3 leading-relaxed flex-grow">
              {post.excerpt}
            </p>
            
            <Link
              href={post.slug ? `/blog/${post.slug}` : "#"}
              className="text-primary font-medium text-sm inline-flex items-center gap-1 group/link mt-auto"
            >
              Read more
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
