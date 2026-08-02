"use client";
import { motion } from "framer-motion";

export default function Logo() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          type: "spring",
          duration: 1.5,
          bounce: 0,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 2,
        },
        opacity: { duration: 0.01 },
      },
    },
  };

  return (
    <motion.div
      animate={{
        // This adds the rotation to the entire SVG
        rotate: [0, 0, 360],
      }}
      transition={{
        duration: 3.5, // 1.5s (draw) + 2s (delay)
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="flex items-center -z-10 justify-center"
    >
      <motion.svg
        width="32"
        height="32"
        className="ms:h-10 ms:w-10"
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
      >
        {/* The "Hub" Box */}
        <motion.rect
          width="80"
          height="80"
          x="10"
          y="10"
          rx="20"
          stroke="#059669" // Emerald-600
          strokeWidth="8"
          fill="transparent"
          variants={draw}
        />
        {/* The "L" for Lagos */}
        <motion.path
          d="M35 30 V70 H70"
          stroke="#059669"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          variants={draw}
        />
      </motion.svg>
    </motion.div>
  );
}
