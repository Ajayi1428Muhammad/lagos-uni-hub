"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";

const Floating = () => {
  const pathname = usePathname();
  if( pathname === "/sell" || pathname === "/sell/") return null;
  const constraintsRef = useRef(null);

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-30"
    >
      {" "}
      {/* Added ref and some styling for the constraint div */}
      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        className="fixed bottom-24 right-6 z-40 bg-amber-400 p-4 rounded-full 
              active:scale-95 transition-all pointer-events-auto
             shadow-[0_15px_30px_-5px_rgba(251,191,36,0.5)] 
             border-t border-white/40 backdrop-blur-sm cursor-pointer "
      >
        <Link href="/sell">
          <PlusIcon className="h-5 w-5 text-slate-900 stroke-3" />
        </Link>
      </motion.button>
    </div>
  );
};

export default Floating;
