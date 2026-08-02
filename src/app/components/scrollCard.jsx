"use client";
import React from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { PhotoIcon } from "@heroicons/react/24/outline";

const ScrollCard = ({ listing = {} }) => {
  const cardWidth = "basis-1/5 lg:basis-1/10";
  const cardHeight = "h-[210px]"; // Taller aspect ratio for that 'Reels' feel
  const squircle = "rounded-[15px]";
  const previewUrl = listing.mediaUrls?.[0] ?? null;

  return (
    <div className={`${cardWidth} ${cardHeight} shrink-0 snap-start min-w-18 lg:min-w-27.5`}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        className={`relative h-full w-full ${squircle} overflow-hidden bg-slate-200 shadow-lg cursor-pointer`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={listing.title || "Listing"}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
            <PhotoIcon className="h-8 w-8" />
          </div>
        )} 

        {/* 2. The Tag Overlay (Minimalist Pointing Right) */}
        <div className="absolute top-3 right-3 p-2 ">
          <EllipsisVerticalIcon className="h-5 w-5 text-[#ffffff] -scale-x-100" />
        </div>

        {/* 3. Subtle Bottom Protection Gradient */}
        
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-40" />
      </motion.div>
    </div>
  );
};

export default ScrollCard;
