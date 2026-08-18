import ImageCarousel from "@/app/components/ImageCarousel"
import ListingDetails from "@/app/components/ListingDetails";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

const ListingsPage = async ({params}) => {
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
  return (
    <main className="max-w-6xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-4 ">
        <div className="flex items-center justify-center mx-auto w-[90%] ">
          <ImageCarousel listing={listing} />
        </div>
        <div className="w-full">
          <ListingDetails listing={listing} />
        </div>
      </div>
    </main>
  );
}

export default ListingsPage
