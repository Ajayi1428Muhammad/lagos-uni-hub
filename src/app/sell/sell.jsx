"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CreateListing from "@/app/sell/detailsPage";
import PricingStep from "@/app/sell/pricingPage";
import ReviewPostStep from "@/app/sell/reviewPage";
import { createListing, saveDraft } from "@/app/actions/listings";

const MAX_MEDIA_SIZE_BYTES = 25 * 1024 * 1024;

const SellPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
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

    if (mediaItem.file.size > MAX_MEDIA_SIZE_BYTES) {
      throw new Error(
        `${mediaItem.file.name} is too large. Maximum allowed size is 25MB.`,
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary environment variables are missing.");
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", mediaItem.file);
    uploadFormData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: uploadFormData,
      },
    );

    const responseText = await response.text();
    const responseIsJson = (response.headers.get("content-type") || "")
      .toLowerCase()
      .includes("application/json");

    let payload = null;
    if (responseIsJson && responseText) {
      try {
        payload = JSON.parse(responseText);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      const cloudinaryError =
        payload?.error?.message ||
        payload?.error ||
        (response.status === 413 ||
        /request entity too large/i.test(responseText)
          ? "Upload is too large. Maximum allowed size is 25MB."
          : null);

      throw new Error(
        cloudinaryError ||
          `Cloudinary upload failed (${response.status}). Please try again.`,
      );
    }

    if (!payload) {
      throw new Error("Upload failed: received an invalid response.");
    }

    return {
      id: payload.public_id,
      fileName: mediaItem.fileName ?? mediaItem.file?.name ?? "media",
      url: payload.secure_url,
      type: mediaItem.type,
      publicId: payload.public_id,
      resourceType: payload.resource_type,
    };
  };

  const handleListingChange = (updates) => {
    setListing((current) => ({
      ...current,
      ...updates,
    }));
    const updatedKeys = Object.keys(updates);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      updatedKeys.forEach((key) => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateCurrentStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!listing.title.trim()) {
        newErrors.title = "Title is required.";
      }
      if (!listing.description.trim()) {
        newErrors.description = "Description is required.";
      }
      if (!listing.category.trim()) {
        newErrors.category = "Category is required.";
      }
      if (!listing.price.trim()) {
        newErrors.price = "Price is required.";
      }
      if (listing.mediaItems.length === 0) {
        newErrors.mediaItems = "Upload at least one image or video.";
      }
    } else if (currentStep === 1) {
      if (!listing.university.trim()) {
        newErrors.university = "University is required.";
      }
      if (!listing.pickupOption.trim()) {
        newErrors.pickupOption = "Pickup option is required.";
      }
      if (!listing.campusRunner.trim()) {
        newErrors.campusRunner = "Campus runner option is required.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleContinue = () => {
    if (validateCurrentStep(step)) {
      setStep((prevStep) => prevStep + 1);
    }
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
      const oversizedMedia = (currentListing.mediaItems ?? []).find(
        (item) => item?.file && item.file.size > MAX_MEDIA_SIZE_BYTES,
      );

      if (oversizedMedia?.file?.name) {
        throw new Error(
          `${oversizedMedia.file.name} is too large. Maximum allowed size is 25MB.`,
        );
      }

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
          errors={errors}
          onChange={handleListingChange}
          onContinue={() => handleContinue()}
        />
      ) : step === 1 ? (
        <PricingStep
          listing={listing}
          errors={errors}
          onBack={() => setStep(0)}
          onChange={handleListingChange}
          onContinue={() => handleContinue()}
        />
      ) : (
        <ReviewPostStep
          listing={listing}
          errors={errors}
          onBack={() => setStep(1)}
          onPost={handlePostListing}
          onSaveDraft={handleSaveDraft}
        />
      )}
    </div>
  );
};

export default SellPage;
