"use client";
import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const EmptyCart = () => {
  const router = useRouter();
  const handleContinueShopping = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 ">
      <ShoppingCartIcon className="h-32 w-32 text-emerald-700" />
      <p className="text-slate-500 font-bold">Your cart is empty!</p>
      <p className="text-xl">
        Browse the marketplace and add some amazing items
      </p>
      <button
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded active:scale-95 transition-all cursor-pointer"
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default EmptyCart;
