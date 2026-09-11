import prisma from "@/lib/prisma"
import EditForm from "@/app/dashboard/listings/[id]/editForm"
import { editListing } from "@/app/actions/listings"
import { toast } from "react-toastify"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

const EditPage = async ({params}) => {
  const { id } = await params
  const session = await auth()
  const listing = await prisma.listings.findUnique({
    where: { id },
  })
  if(!session?.user?.id){
    redirect("/signin?callbackUrl=/dashboard")
  }
  if(listing?.userId !== session?.user?.id){
    redirect("/dashboard")
  }
  if (!listing) {
    throw new Error("Listing not found")
  }
  
  return (
    <div>
      <EditForm listing={listing} />
    </div>
  )
}

export default EditPage
