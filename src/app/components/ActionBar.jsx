"use client"
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';

const ActionBar = ({ listing, isSeller }) => {
  const router = useRouter();
  const handleCartPush = () => {
    router.push("/cart")
  }

  // const getItemQuantity = useCartStore((state) => state.getItemQuantity) 
  const quantity = useCartStore(
    (state) =>
      state.cart.find((item) => item.id === listing?.id)?.quantity || 0,
  );
  const increaseQuantity = useCartStore((state) => state.increaseQuantity); 
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  
    if (isSeller) {
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-300 p-3 z-50 flex items-center w-full mx-auto">
          <button
            type="button"
            className="w-[calc(100%-5rem)] sm:w-[calc(100%-7rem)] md:w-[calc(100%-10rem)] max-w-md mx-auto py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-3xl text-sm flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
          >
            <span>Edit Availability</span>
          </button>
        </div>
      );
    }
    
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-300 p-3 z-50 flex items-center w-full mx-auto shadow-lg">
        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => {
              increaseQuantity(listing);
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-3xl text-sm flex items-center justify-center active:scale-95 transition-transform cursor-pointer  max-w-md mx-auto"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            <span>Include in your glorious cart</span>
          </button>
        ) : (
          <div className="flex gap-3 justify-between items-center w-full max-w-180 mx-auto">
            <div className="flex items-center justify-between bg-slate-100 rounded-3xl p-1 border border-black w-1/3">
              <button
                type="button"
                onClick={() => decreaseQuantity(listing.id)}
                className="p-2 active:scale-90 transition-transform cursor-pointer"
              >
                <MinusIcon className="h-4 w-4" />
              </button>

              <span className="font-bold text-slate-800 text-sm">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => increaseQuantity(listing)}
                className="p-2 active:scale-90 transition-transform cursor-pointer"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Buy Now / Proceed to Checkout */}
            <button
              type="button"
              onClick={handleCartPush}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-3xl text-sm active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Buy Now ({quantity})
            </button>
          </div>
        )}
      </div>
    );
}

export default ActionBar;