import { div } from "framer-motion/client"
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileTabs from "@/app/components/profileTab";
import UserProfile from "@/app/components/userProfile";

const Dashboard = async () => {
  const session = await auth();
  if(!session){
    redirect("/signin?callbackUrl=/dashboard")
  }
  const userListings = await prisma.listings.findMany(
    { where: { userId: session.user.id } }
  )
  const listingsCount = await prisma.listings.count({
    where: { userId: session.user.id }
  });
  return (
    <div className="w-[80%] mx-auto mt-6 ">
      <UserProfile user={session.user} listingsCount={listingsCount} />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/signin?callbackUrl=/dashboard" });
        }}
        className="mt-6 flex"
      >
        <button
          type="submit"
          className="w-full mx-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm  max-w-xs sm:max-w-sm border border-gray-300 active:scale-[0.98] p-3 text-center cursor-pointer  transition-all"
        >
          Sign Out
        </button>
      </form>
      <div>
        <ProfileTabs listings={userListings} />
      </div>
    </div>
  );
}

export default Dashboard
