import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ProfileIcon = () => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };
  useEffect( () => {
    if(clicked){
      document.body.style.overflow = "hidden"
    } else{
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [clicked])
  return (
    <button
      aria-label="Profile"
      className="rounded p-1.5 hover:bg-gray-100 ms:p-2 cursor-pointer"
    >
        <UserCircleIcon className="h-5 w-5 text-gray-600 ms:h-6 ms:w-6 " />
    </button>
  );
};

export default ProfileIcon;
