"use client"
import { useCartStore } from "@/store/useCartStore"
import EmptyCart from "@/app/components/cart/emptyCart"
import CartItem from "@/app/components/cart/cartItem"
import { useState, useEffect } from "react"

const Cart = () => {
    const [isLoading, setIsLoading] = useState(true)
    const isEmpty = useCartStore((state) => state.cart.length === 0)
    const quantity = useCartStore((state) => state.getSelectedCount()) ?? 0;
    const cart = useCartStore((state) => state.cart)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <span className="animate-spin h-12 w-12 border-2 border-emerald-600 border-t-transparent rounded-full inline-block" />
        </div>
      );
    }
    return (
        <div className="w-full ">
            <p className="mt-4 font-bold text-emerald-500">Your cart: ({quantity}) items</p>
            <div className="pl-0">
            {isEmpty ? (
                <EmptyCart />
            ) : (
                <div className="">
                    {cart.map((item, index) => (
                            <CartItem key={item.id} item={item} isFirst={index === 0} />
                        ))}
                </div>
            )}
            </div>
        </div>
    )
}
export default Cart