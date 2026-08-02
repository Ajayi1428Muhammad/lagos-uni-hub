"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CreateListing from "@/app/sell/detailsPage";
import PricingStep from "@/app/sell/pricingPage";
import ReviewPostStep from "@/app/sell/reviewPage";
import { createListing, saveDraft } from "@/app/actions/listings";

const SellPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [listing, setListing] = useState({
    id: null,
    mediaItems: [],
    title: "",
    price: "",
    description: "",
    category: "",
    university: "",
    pickupOption: "",
    campusRunner: "",
  });
  const mediaItemsRef = useRef(listing.mediaItems);

  const uploadMediaToCloudinary = async (mediaItem) => {
    if (!mediaItem?.file) {
      return mediaItem;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", mediaItem.file);

    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: uploadFormData,
    });

    const payload = await response.json();
    //
    if (!response.ok) {
      throw new Error(payload?.error || "Cloudinary upload failed.");
    }

    return {
      id: payload.publicId,
      fileName: mediaItem.fileName ?? mediaItem.file?.name ?? "media",
      url: payload.url,
      type: mediaItem.type,
      publicId: payload.publicId,
      resourceType: payload.resourceType,
    };
  };

  const handleListingChange = (updates) => {
    setListing((current) => ({
      ...current,
      ...updates,
    }));
  };

  const revokeLocalPreviews = (items = []) => {
    items.forEach((item) => {
      if (item?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(item.url);
      }
    });
  };

  const resetForm = () => {
    revokeLocalPreviews(listing.mediaItems);
    setListing({
      id: null,
      mediaItems: [],
      title: "",
      price: "",
      description: "",
      category: "",
      university: "",
      pickupOption: "",
      campusRunner: "",
    });
    setStep(0);
  };

  const handlePostListing = async (currentListing) => {
    try {
      const uploadedMediaItems = await Promise.all(
        (currentListing.mediaItems ?? []).map((mediaItem) =>
          uploadMediaToCloudinary(mediaItem),
        ),
      );

      await createListing({
        ...currentListing,
        mediaItems: uploadedMediaItems,
      });
      toast.success("Listing posted to marketplace!");
      router.push("/");
      resetForm();
    } catch (error) {
      console.error("Failed to publish listing:", error);
      toast.error(error?.message || "Failed to publish listing.");
      return null;
    }
  };

  const handleSaveDraft = async (currentListing) => {
    try {
      const savedListing = await saveDraft(currentListing);
      if (savedListing?.id) {
        setListing((current) => ({ ...current, id: savedListing.id }));
      }
      return savedListing;
    } catch (error) {
      console.error("Failed to save draft:", error);
      throw error;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    mediaItemsRef.current = listing.mediaItems;
  }, [listing.mediaItems]);

  useEffect(() => {
    return () => {
      revokeLocalPreviews(mediaItemsRef.current);
    };
  }, []);

  return (
    <div>
      {step === 0 ? (
        <CreateListing
          listing={listing}
          onChange={handleListingChange}
          onContinue={() => setStep(1)}
        />
      ) : step === 1 ? (
        <PricingStep
          listing={listing}
          onBack={() => setStep(0)}
          onChange={handleListingChange}
          onContinue={() => setStep(2)}
        />
      ) : (
        <ReviewPostStep
          listing={listing}
          onBack={() => setStep(1)}
          onPost={handlePostListing}
          onSaveDraft={handleSaveDraft}
        />
      )}
    </div>
  );
};

export default SellPage;
