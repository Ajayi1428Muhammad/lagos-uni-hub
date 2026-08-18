"use client";

import { useEffect, useRef, useState } from "react";
import {
  PhotoIcon,
  VideoCameraIcon,
  ChevronDownIcon,
  PlusIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const MAX_MEDIA_SIZE_BYTES = 25 * 1024 * 1024;

const CreateListing = ({
  listing = {},
  errors,
  onChange = () => {},
  onContinue = () => {},
}) => {
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([
    "Gadgets",
    "Book",
    "Fashion",
    "Skincare",
    "Other",
  ]);
  const [categoryQuery, setCategoryQuery] = useState(listing.category ?? "");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const categoryWrapperRef = useRef(null);
  const mediaItems = listing.mediaItems ?? [];
  const photoCount = mediaItems.filter((item) =>
    item.type.startsWith("image/"),
  ).length;
  const videoCount = mediaItems.filter((item) =>
    item.type.startsWith("video/"),
  ).length;
  const totalCount = mediaItems.length;

  const addMedia = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const existingPhotoCount = mediaItems.filter((item) =>
      item.type.startsWith("image/"),
    ).length;
    const hasVideo = mediaItems.some((item) => item.type.startsWith("video/"));

    const validFiles = [];
    const oversizedFiles = [];
    let photoCount = existingPhotoCount;
    let videoAdded = hasVideo;

    selectedFiles.forEach((file) => {
      if (file.size > MAX_MEDIA_SIZE_BYTES) {
        oversizedFiles.push(file.name || "One selected file");
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (isImage && photoCount < 5) {
        validFiles.push(file);
        photoCount += 1;
      }

      if (isVideo && !videoAdded) {
        validFiles.push(file);
        videoAdded = true;
      }
    });

    if (oversizedFiles.length > 0) {
      const prefix =
        oversizedFiles.length === 1
          ? oversizedFiles[0]
          : `${oversizedFiles.length} files`;
      toast.error(`${prefix} exceed the 25MB upload limit.`);
    }

    if (!validFiles.length) {
      event.target.value = "";
      return;
    }

    const localItems = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
      file,
      fileName: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      isLocal: true,
    }));

    onChange({ mediaItems: [...mediaItems, ...localItems] });
    event.target.value = "";
  };

  const removeMedia = async (id) => {
    const itemToRemove = mediaItems.find((item) => item.id === id);

    if (itemToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(itemToRemove.url);
    }

    onChange({
      mediaItems: mediaItems.filter((item) => item.id !== id),
    });
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setCategoryQuery(listing.category ?? "");
  }, [listing.category]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        categoryWrapperRef.current &&
        !categoryWrapperRef.current.contains(event.target)
      ) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(categoryQuery.trim().toLowerCase()),
  );

  const handleAddCategory = () => {
    const nextCategory = categoryQuery.trim();

    if (!nextCategory) {
      return;
    }

    const alreadyExists = categories.some(
      (category) => category.toLowerCase() === nextCategory.toLowerCase(),
    );

    if (!alreadyExists) {
      setCategories((current) => [nextCategory, ...current]);
    }

    onChange({ category: nextCategory });
    setCategoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-3">
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-xs ms:text-3xl font-black text-slate-900 tracking-tight ">
          Create New Listing
        </h1>
      </div>

      {/* 1. UNIFIED MEDIA UPLOAD */}
      <div className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <label className="block text-[10px] ms:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Media & Photos
          </label>
          <span className="text-[5px] ms:text-[7px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {photoCount} photos · {videoCount} videos · {totalCount} total
          </span>
        </div>
        <div className="relative group">
          <button
            type="button"
            onClick={openFilePicker}
            className="flex flex-col items-center justify-center w-full h-40 ms:h-56 border-2 border-dashed border-slate-200 rounded-4xl bg-white hover:bg-slate-50 hover:border-emerald-300 transition-all cursor-pointer overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-4 bg-emerald-50 rounded-2xl mb-3">
                <PhotoIcon className="w-6 ms:w-8 h-6 ms:h-8 text-emerald-600" />
              </div>
              <p className="text-xs ms:text-sm font-bold text-slate-700">
                Add Photos or Video
              </p>
              <p className="text-[10px] ms:text-xs text-slate-400 mt-1">
                Up to 5 images and 1 video (max 25MB per file)
              </p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*,video/*"
            onChange={addMedia}
            capture="environment"
          />
          {errors?.mediaItems && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.mediaItems}
            </p>
          )}
        </div>

        {mediaItems.length > 0 ? (
          <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {mediaItems.map((item) => {
              const isVideo = item.type.startsWith("video/");

              return (
                <div
                  key={item.id}
                  className="relative shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm h-20 w-20 ms:h-28 ms:w-28"
                >
                  <button
                    type="button"
                    onClick={() => removeMedia(item.id)}
                    aria-label="Remove media"
                    className="absolute right-1 top-1 z-10 rounded-full bg-black/55 p-1 text-white backdrop-blur-sm transition hover:bg-black/75 cursor-pointer"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>

                  {isVideo ? (
                    <video
                      src={item.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.fileName || item.file?.name || "Uploaded media"}
                      className="h-full w-full object-cover"
                    />
                  )}

                  {isVideo ? (
                    <div className="absolute inset-0 flex items-end justify-start bg-linear-to-t from-black/50 via-black/10 to-transparent p-2">
                      <div className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        <VideoCameraIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* 2. BASICS FORM */}
      <div className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            What are you selling?
          </label>
          <input
            type="text"
            placeholder="e.g. Hp elitebook 840 g3"
            value={listing.title ?? ""}
            onChange={(event) => onChange({ title: event.target.value })}
            className={`w-full bg-white  rounded-2xl px-5 py-2 ms:py-4 text-xs ms:text-sm font-medium  ring-emerald-500 outline-none shadow-sm
              ${errors?.title ? "border border-red-500 focus:ring-1 focus:ring-red-500" : "border border-slate-100 focus:ring-2"}
              `}
          />
          {errors?.title && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.title}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Price (₦)
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
              ₦
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={listing.price ?? ""}
              onChange={(event) => onChange({ price: event.target.value })}
              className={`w-full rounded-2xl pl-10 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none shadow-sm
                ${
                  errors?.price
                    ? "border border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border border-slate-100 focus:ring-2 ring-emerald-500"
                }`}
            />
          </div>
          {errors?.price && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {" "}
              {errors.price}{" "}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Category
          </label>
          <div className="flex items-center justify-between gap-2 ms:gap-3">
            <div ref={categoryWrapperRef} className="relative flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={categoryQuery}
                  placeholder="Select or type category"
                  onFocus={() => setCategoryOpen(true)}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setCategoryQuery(nextValue);
                    onChange({ category: nextValue });
                    setCategoryOpen(true);
                  }}
                  className={`w-full rounded-2xl bg-white px-4 py-2 ms:py-4 pr-12 text-left text-xs ms:text-base font-medium text-slate-900 shadow-sm transition-all duration-200 ring-emerald-500 ${
                    errors?.category
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border border-slate-100 focus:ring-2 focus:outline-none"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setCategoryOpen((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700"
                  aria-label="Toggle category options"
                >
                  <ChevronDownIcon className="h-5 w-5" />
                </button>
              </div>

              {categoryOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg shadow-emerald-100">
                  <button
                    type="button"
                    className="w-full bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-400 hover:bg-emerald-50 hover:text-emerald-900"
                    onClick={() => {
                      setCategoryQuery("");
                      onChange({ category: "" });
                      setCategoryOpen(false);
                    }}
                  >
                    Select category
                  </button>

                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const selected = category === (listing.category ?? "");

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setCategoryQuery(category);
                            onChange({ category });
                            setCategoryOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-900 ${
                            selected
                              ? "bg-emerald-100 font-semibold text-emerald-900"
                              : "bg-white text-slate-700"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">
                      No category found. Use the plus button to add "
                      {categoryQuery.trim() || "new category"}".
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleAddCategory}
              className="bg-emerald-600 text-white font-bold p-2 ms:p-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg  cursor-pointer"
              aria-label="Add category"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
            {errors?.category && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.category}
              </p>
            )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about the condition, history, etc..."
            value={listing.description ?? ""}
            onChange={(event) => onChange({ description: event.target.value })}
            className={`w-full bg-white border border-slate-100 rounded-2xl px-5 py-2 ms:py-4 text-xs ms:text-sm font-medium focus:ring-2 ring-emerald-500 outline-none shadow-sm resize-none
              ${
                errors?.description
                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border border-slate-100 focus:ring-2 focus:outline-none"
              }`}
          />
          {errors?.description && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <div className=" bottom w-full p-4 ms:p-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onContinue()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 ms:p-4 rounded-2xl flex items-center justify-center mx-auto gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-200 cursor-pointer max-w-md"
        >
          {isLoading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
              <span>Continuing...</span>
            </>
          ) : (
            <span className="text-xs ms:text-sm">Continue to Pricing</span>
          )}
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CreateListing;
