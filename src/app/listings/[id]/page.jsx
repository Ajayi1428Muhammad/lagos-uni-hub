import ImageCarousel from "@/app/components/ImageCarousel"
import ListingDetails from "@/app/components/ListingDetails";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import React from "react";
import ActionBar from "@/app/components/ActionBar";

const ListingsPage = async ({params}) => {
  const session = await auth();
  const {id} = await params;
  let listing = null;
  try{
    listing = await prisma.listings.findUnique({
      where: {id},
      include:{
        user:true
      }
    });
  } catch(error){
    console.error("Failed to fetch listings:", error)
  };
  if(!listing){
    notFound();
  }
    const isSeller = session?.user?.id === listing.userId;
  
  return (
    <main className="max-w-6xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-4 ">
        <div className="mx-auto w-[90%] ">
          <ImageCarousel listing={listing} isSeller={isSeller} />
        </div>
        <div>
        <div className="w-full">
          <ListingDetails listing={listing} isSeller={isSeller} />
        </div>
        <div className="max-w-sm"> 
        <ActionBar isSeller={isSeller} listing={listing} />
        </div>
        </div>
      </div>
    </main>
  );
}

export default ListingsPage
