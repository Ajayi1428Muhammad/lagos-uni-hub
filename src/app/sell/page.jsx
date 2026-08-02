import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SellPage from "@/app/sell/sell";

import React from 'react'

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/signin?callbackUrl=/sell");
  }
  return (
    <div>
      <SellPage />
    </div>
  )
}

export default page
