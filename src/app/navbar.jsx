"use client";
import { useState, Suspense } from "react";
import React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Bar from "@/app/components/bar";
import Logo from "@/app/components/Logo";
import SearchBar from "@/app/components/SearchBar";
import NotificationIcon from "@/app/components/Notification";
import ProfileIcon from "./components/Profile";
import Link from "next/link";

const Navbar = ({session}) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    // 1. Hide if scrolling down and past the header height
    // 2. Show if scrolling up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });
  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed z-50 flex h-16 w-full items-center gap-2  border-b border-gray-200 bg-white px-2 ms:h-16 ms:px-4"
    >
      {/* Left: Logo and Menu */}
      <div className="flex shrink-0 items-center gap-1 ms:gap-3">
        <Bar />
        <Logo />
      </div>

      {/* Center: Search */}
      <div className="min-w-0 flex-1">
        <Suspense
          fallback={<div className="h-9 w-full rounded-full bg-gray-100" />}
        >
          <SearchBar />
        </Suspense>
      </div>

      {/* Right: Notification and Profile */}
      <div className="flex shrink-0 items-center gap-1 ms:gap-2 md:gap-4">
        <NotificationIcon />
        <Link href="/dashboard">
          {session?.user?.image ? (
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
              <img
                src={session.user.image}
                alt={session.user.name || "User profile"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition">
              <ProfileIcon className="w-6 h-6" />{" "}
              {/* Default structural profile icon */}
            </div>
          )}
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
