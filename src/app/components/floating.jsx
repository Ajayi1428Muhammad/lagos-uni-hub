"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { PlusIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";

const Floating = () => {
  const quantity = useCartStore((state) => state.getCartCount());
  const pathname = usePathname();
  const constraintsRef = useRef(null);
  const router = useRouter();

  if (pathname === "/sell" || pathname === "/sell/") return null;
  if (pathname === "/cart" || pathname === "/cart/") return null;
  if (pathname === "/dashboard" || pathname === "/dashboard/") return null;
  const isDetailsPage = /^\/listings\/[^\/]+$/.test(pathname);
  // if (isDetailsPage) return null;
  const handleSellClick = () => {
    router.push("/sell");
  };
  const handleCartClick = () => {
    router.push("/cart");
  };
  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-30"
    >
      {isDetailsPage ? (
        <div className="relative">
          <motion.button
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            className="fixed  bottom-24 right-6 z-40 bg-amber-400 p-4 rounded-full 
              active:scale-95 transition-all pointer-events-auto
             shadow-[0_15px_30px_-5px_rgba(251,191,36,0.5)] 
             border-t border-white/40 backdrop-blur-sm cursor-pointer "
            onClick={(e) => {
              e.preventDefault();
              handleCartClick();
            }}
          >
            <span className="absolute top-0 right-0 text-slate-200 font-bold bg-amber-400 border-2 border-white rounded-full h-6 w-6 p-1 flex items-center justify-center ">
              {quantity}
            </span>
            <ShoppingCartIcon className="h-5 w-5 text-slate-900 stroke-3" />
          </motion.button>
        </div>
      ) : (
        <motion.button
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          className="fixed bottom-24 right-6 z-40 bg-amber-400 p-4 rounded-full 
              active:scale-95 transition-all pointer-events-auto
             shadow-[0_15px_30px_-5px_rgba(251,191,36,0.5)] 
             border-t border-white/40 backdrop-blur-sm cursor-pointer "
          onClick={(e) => {
            e.preventDefault();
            handleSellClick();
          }}
        >
          <PlusIcon className="h-5 w-5 text-slate-900 stroke-3" />
        </motion.button>
      )}
    </div>
  );
};

export default Floating;
