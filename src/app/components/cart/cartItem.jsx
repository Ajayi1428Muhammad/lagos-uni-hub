import React from "react";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import Stepper from "@/app/listings/[id]/Stepper";

const CartItem = ({ item, isFirst }) => {
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const quantity = useCartStore(
    (state) =>
      state.cart.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0,
  );
  const price = item.price;
  const formatPrice = (price) => {
    const cleanPrice =
      typeof price === "string" ? price.replace(/[^0-9.]/g, "") : price;
    if (!price && price !== 0) return "";
    const n = Number(cleanPrice);
    return n.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    });
  };
  return (
    <div className="relative flex items-center gap-3 rounded-[28px] bg-slate-200 p-3 sm:p-4 m-2 shadow-sm  w-full">
      <div className="relative h-16 w-16 ms:h-20 ms:w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl bg-gray-100 shrink-0">
        <Image
          src={item.mediaUrls}
          alt={item.title}
          fill
          priority={isFirst}
          sizes="(max-width: 640px) 80px, 96px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3 w-full">
          <Link href={`/listings/${item.id}`} className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2 cursor-pointer sm:text-lg">
              {item.title} {item.description}
            </div>
          </Link>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:text-slate-700"
          >
            <TrashIcon className="h-4 w-4 sm:h-4 sm:w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 w-full">
          <div className="text-sm font-medium text-slate-800 sm:text-base">
            {formatPrice(item.price)}
          </div>

          <div className="ml-auto rounded-3xl border border-black bg-slate-100 p-1">
            <Stepper
              onIncrease={() => increaseQuantity(item.id)}
              onDecrease={() => decreaseQuantity(item.id)}
              quantity={quantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
