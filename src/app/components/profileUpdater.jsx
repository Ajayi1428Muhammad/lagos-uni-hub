import ProfileIcon from "@/app/components/Profile";

import React from 'react'

const ProfileUpdater = async ({ session }) => {
  return (
    <div>
      { session ? <img src={session.user?.image} alt="" /> : <ProfileIcon /> }
    </div>
  )
}

export default ProfileUpdater
