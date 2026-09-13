"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const normalizeListingData = (listing = {}) => {
  const data = {};

  if (listing.title !== undefined) {
    data.title = listing.title?.trim() || "Untitled listing";
  }
  if (listing.price !== undefined) {
    data.price = Number(listing.price) || 0;
  }
  if (listing.description !== undefined) {
    data.description = listing.description?.trim() || "";
  }
  if (listing.university !== undefined) {
    data.university = listing.university?.trim() || "";
  }
  if (listing.pickupOption !== undefined) {
    data.pickupLocation = listing.pickupOption?.trim() || "";
  }
  if (listing.campusRunner !== undefined) {
    data.campusRunner = listing.campusRunner?.trim() || "";
  }
  if (listing.category !== undefined) {
    data.category = listing.category?.trim() || "Uncategorized";
  }
  if (listing.mediaItems !== undefined) {
    data.mediaUrls = Array.isArray(listing.mediaItems)
      ? listing.mediaItems
          .map((item) => item?.url)
          .filter(
            (url) =>
              typeof url === "string" &&
              (url.startsWith("http://") || url.startsWith("https://")),
          )
      : [];
  }
  if (listing.stock !== undefined) {
    data.stock = Number(listing.stock) || 1;
  }

  return data;
};

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

export async function editListing(listing = {}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  if (!listing.id) {
    throw new Error("Listing id is required.");
  }
  const existingListing = await prisma.listings.findUnique({
    where: {id: listing.id},
    select: {userId: true},
  })
  if(!existingListing || existingListing.userId !== session.user.id){
    throw new Error("You are not allowed to edit this!");
  }
  const data = normalizeListingData(listing)
  return prisma.listings.update({
    where: { id: listing.id },
    data
  })

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
