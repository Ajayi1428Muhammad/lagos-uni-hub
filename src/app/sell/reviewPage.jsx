"use client";

import React, { useMemo } from "react";
import { toast } from "react-toastify";
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

const ReviewPostStep = ({
  listing = {},
  onBack = () => {},
  onPost = () => {},
  onSaveDraft = () => {},
}) => {
    const [isLoading, setIsLoading] = useState(false);
  const handleSaveDraftClick = async () => {
    const missing = validateListing();

    try {
      if (missing.length > 0) {
        toast.warning(`${missing.join(", ")}. Saving as draft instead`);
      }

      await onSaveDraft(listing);
      toast.success("Draft saved successfully!");
    } catch (error) {
      toast.error("Failed to save draft. Please try again.");
      console.error("Failed to save draft:", error);
    }
  };

  const handlePostClick = async () => {
    await onPost(listing);
  };
  const previewMedia = useMemo(() => {
    return listing.mediaItems?.[0] ?? null;
  }, [listing.mediaItems]);

  const priceValue = listing.price ? Number(listing.price) : null;

  const formattedPrice = useMemo(() => {
    if (priceValue === null || Number.isNaN(priceValue)) {
      return "₦0";
    }

    return `₦${priceValue.toLocaleString("en-NG")}`;
  }, [priceValue]);

  const detailRows = [
    { label: "Title", value: listing.title },
    {
      label: "Description",
      value: listing.description 
    },
    { label: "Category", value: listing.category  },
    { label: "Price", value: formattedPrice },
    {
      label: "Target University Hub",
      value: listing.university 
    },
    { label: "Pickup Option", value: listing.pickupOption  },
    { label: "Campus Runner", value: listing.campusRunner },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-5 pb-8 pt-3 ms:px-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-semibold text-emerald-700 cursor-pointer"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 ms:text-4xl">
              Review Listing
            </h1>
            <p className="mt-2 max-w-md  text-[10px] sm:text-sm text-slate-500 ms:text-base">
              Confirm the media, details, and pricing before you publish the
              listing.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <section className="overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white shadow-sm">
          <div className="relative bg-slate-950">
            {previewMedia.type?.startsWith("video/") ? (
              <video
                src={previewMedia.url}
                className="h-80 w-full object-cover ms:h-112"
                muted
                playsInline
                controls
              />
            ) : (
              <img
                src={previewMedia.url}
                alt={listing.title}
                className="h-80 w-full object-cover ms:h-112"
              />
            )}

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-emerald-700/95 px-4 py-2 text-xs font-bold tracking-[0.18em] text-white shadow-lg shadow-emerald-950/20 backdrop-blur-sm">
              <span>Preview</span>
              {previewMedia?.type?.startsWith("video/") ? (
                <VideoCameraIcon className="h-4 w-4" />
              ) : (
                <PhotoIcon className="h-4 w-4" />
              )}
            </div>
          </div>

          <div className="border-t border-emerald-100 p-5 ms:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-wide text-emerald-700">
                  {listing.university || "Campus listing"}
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 ms:text-3xl">
                  {listing.title || "Untitled listing"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {listing.pickupOption || "Pickup option not selected"}
                  {listing.campusRunner ? ` • ${listing.campusRunner}` : ""}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Price
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-emerald-800">
                  {formattedPrice}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {listing.university ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {listing.university}
                </span>
              ) : null}
              {listing.category ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {listing.category}
                </span>
              ) : null}
              {listing.pickupOption ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {listing.pickupOption}
                </span>
              ) : null}
              {listing.campusRunner ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {listing.campusRunner}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm ms:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <ChevronLeftIcon className="h-5 w-5 rotate-90" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950">
                Listing Details
              </h3>
              <p className="text-sm text-slate-500">
                Everything captured from the previous steps.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {detailRows.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {row.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-900 ms:text-base">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="submit"
          onClick={handlePostClick}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-5 py-4 mx-auto text-base font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:bg-emerald-700 active:scale-[0.99] max-w-md cursor-pointer"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
              <span>Posting...</span>
            </>
          ) : (
            <span>Post to Marketplace</span>
          )}

          <ArrowUpRightIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleSaveDraftClick}
          className="flex w-full items-center justify-center mx-auto max-w-md gap-3 rounded-2xl border border-emerald-600 bg-white px-5 py-4 text-base font-bold text-emerald-700 transition-all duration-200 cursor-pointer hover:bg-emerald-50 active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save as Draft</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewPostStep;
