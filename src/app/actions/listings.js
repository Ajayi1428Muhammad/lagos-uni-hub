"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const normalizeListingData = (listing = {}) => ({
  title: listing.title?.trim() || "Untitled listing",
  price: Number(listing.price) || 0,
  description: listing.description?.trim() || "",
  university: listing.university?.trim() || "",
  pickupLocation: listing.pickupOption?.trim() || "",
  campusRunner: listing.campusRunner?.trim() || "",
  category: listing.category?.trim() || "Uncategorized",
  mediaUrls: Array.isArray(listing.mediaItems)
    ? listing.mediaItems
        .map((item) => item?.url)
        .filter(
          (url) =>
            typeof url === "string" &&
            (url.startsWith("http://") || url.startsWith("https://")),
        )
    : [],
});

export async function createListing(listing = {}) {
  const session = await auth();
  if (!session || !session.user?.id) {
    redirect("/signin?callbackUrl=/sell");
  }
  const data = normalizeListingData(listing);

  // If listing has an ID (already a draft), update it; otherwise create new
  if (listing.id) {
    return prisma.listings.update({
      where: { id: listing.id },
      data,
    });
  }

  return prisma.listings.create({
    data: {
      ...data,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });
}

export async function saveDraft(listing = {}) {
  const data = normalizeListingData(listing);

  // If listing has an ID, update the existing record; otherwise create new
  if (listing.id) {
    return prisma.listings.update({
      where: { id: listing.id },
      data,
    });
  }

  return prisma.listings.create({
    data,
  });
}
