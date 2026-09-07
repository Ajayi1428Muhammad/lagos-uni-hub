import {useState , useEffect} from "react"
import {ShoppingCartIcon} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const NotificationIcon = () => {
  const router = useRouter();
  const handleCartPush = () => {
    router.push("/cart")
  }

  return (
    <button
      aria-label="Cart"
      className="relative rounded p-1.5 hover:bg-gray-100 ms:p-2 cursor-pointer"
      onClick={handleCartPush}
    >
      <ShoppingCartIcon className="h-5 w-5 text-gray-600 ms:h-6 ms:w-6" />
      <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500 ms:h-2 ms:w-2 " />
    </button>
  );
};

export default NotificationIcon;
