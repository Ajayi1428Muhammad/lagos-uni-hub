"use client"

const UserProfile = ( { user, listingsCount } ) => {
  
  return (
    <div>
      <div className="flex w-full flex-col h-full mt-4 mb-4">
        <div className="flex justify-center  mx-auto gap-5 h-auto py-4 sm:py-6 p-4">
          <div className=" h-16 w-16 ms:h-32 ms:w-32 aspect-square rounded-full overflow-hidden shrink-0 m-auto">
            <img
              src={user?.image || "/profile.jpg"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <div>{user?.name}</div>
            {/* details */}
            <div className="flex gap-2 ">
              <a href="#listings">
                <span>{listingsCount}</span> listings
              </a>
              <div>
                <span>0</span> followers
              </div>
              <div>
                <span>0</span> sales
              </div>
            </div>
            <div>Description</div>
          </div>
        </div>
        <div className="flex justify-center ">
          <div className=" w-full max-w-xs sm:max-w-sm bg-gray-200 border border-gray-300 hover:bg-gray-300 active:scale-[0.98] p-3 text-center cursor-pointer rounded-lg font-medium text-gray-700 text-sm transition-all">
            Edit Profile
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile