import {
  PhotoIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import getTime from "@/lib/formatDate";

const Card = ({ listing = {}, title, description, price, isFeatured }) => {
  const displayTitle = title ?? listing.title ?? "Untitled";
  const displayDescription = description ?? listing.description ?? "";
  const displayPrice = price ?? listing.price ?? null;
  const timeCreated = listing.createdAt;
  const timestamp = getTime(timeCreated);
  const previewUrl = listing.mediaUrls?.[0] ?? null;
  const isVideo =
    previewUrl !== null &&
    /\.(mp4|mov|webm|mkv|avi|m4v)(\?.*)?$/i.test(previewUrl);

  const formatPrice = (val) => {
    if (!val && val !== 0) return "";
    const n = Number(val);
    if (Number.isNaN(n)) return val;
    return `${n.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}`;
  };
  return (
    <div className="break-inside-avoid mb-3 bg-white rounded-xl border border-slate-100 shadow-lg overflow-hidden transition-transform duration-700 hover:scale-102 cursor-pointer">
      {/* --- Image Section --- */}
      <div className="relative">
        {/* Placeholder for the product image */}
        <div className="w-full aspect-4/4 bg-slate-100 object-cover flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            isVideo ? (
              <video
                src={previewUrl}
                className="h-full w-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={previewUrl}
                alt={displayTitle}
                className="object-cover w-full h-full"
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              <PhotoIcon className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Featured Label */}
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-amber-400 px-1.5 py-0.5 rounded-md shadow-sm">
            <span className="text-[10px] flex items-center justify-center p-1 font-black uppercase text-slate-900 leading-none">
              Featured
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-2.5 rounded-full bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all border border-white/20">
          <HeartIconSolid className="h-3.5 w-3.5 text-slate-900" />
        </button>

        {/* Video/Timestamp Indicator */}
        {previewUrl && isVideo && (
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-lg px-2 py-1 rounded-lg flex items-center gap-2">
            <>
              <VideoCameraIcon className="h-2 w-2  text-white" />
              <span className="text-[8px]  text-white font-bold uppercase tracking-tighter">
                0:24
              </span>
            </>
          </div>
        )}
      </div>

      {/* --- Details Section --- */}
      <div className="p-5 pt-4">
        <div className="flex flex-col items-start justify-between gap-2 ">
          <h3 className="text-left md:text-sm font-bold text-slate-800 line-clamp-2 leading-tight text-xs ">
            {displayTitle}
            {displayDescription ? `. ${displayDescription}` : ""}
          </h3>
        </div>
        <div className="flex justify-between pt-2 flex-wrap">
          <div className="flex flex-col">
          <span className="text-[#059669] font-black text-sm ms:text-base whitespace-nowrap">
            {formatPrice(displayPrice) || "Price not set"}
          </span>
          <span className="text-xs text-slate-500">{timestamp}</span>
          </div>
          <button className="p-2.5 text-right items-end rounded-xl text-slate-500 bg-slate-100 transition-colors hover:bg-slate-200 cursor-pointer">
            <ShoppingCartIcon className="h-2.5 w-2.5 ms:w-4.5 ms:h-4.5 stroke-2 shadow-inner" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-end"></div>
      </div>
    </div>
  );
};

export default Card;
