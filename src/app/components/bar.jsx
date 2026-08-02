import React from "react";
import {
  Bars3Icon,
  Bars2Icon,
  XMarkIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { div } from "framer-motion/client";

const Bar = () => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };

  useEffect(() => {
    if (clicked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [clicked]);
  const deals = [
    "Hot Deals 🔥",
    "new Arrivals",
    "Flash Sales",
    "Student Discounts",
    "Seasonal Offers",
    "Clearance",
  ];
  return (
    <div>
      <div
        aria-label="Menu"
        className="relative z-110 rounded p-1.5 hover:bg-gray-100 ms:p-2"
      >
        <motion.div
          key={clicked ? "open" : "closed"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          className="relative z-110 cursor-pointer"
        >
          {clicked ? (
            <XMarkIcon className="h-5 w-5  text-gray-600 ms:h-6 ms:w-6" />
          ) : (
            <Bars3Icon className="h-5 w-5  text-gray-600 ms:h-6 ms:w-6" />
          )}
        </motion.div>
      </div>
      {clicked && (
        <div className="fixed inset-0 z-100 flex flex-col bg-white/60 backdrop-blur-lg transition-all">
          {/* 3. The Links Menu - Matching your font-mono and spacing */}
          <nav className="flex-1 flex flex-col overflow-y-auto justify-center items-center px-10">
            <ul className="flex flex-col gap-8 tracking-[0.2em] items-center font-mono text-xl text-slate-800 uppercase">
              {deals.map((deal, index) => (
                <li
                  key={index}
                  className="flex group hover:text-emerald-600 cursor-pointer transition-colors"
                >
                  <TagIcon className="h-5 w-5 rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {deal}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Bar;
