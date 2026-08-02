import {useState , useEffect} from "react"
import { BellIcon } from "@heroicons/react/24/outline";

const NotificationIcon = () => {
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
      aria-label="Notifications"
      className="relative rounded p-1.5 hover:bg-gray-100 ms:p-2 cursor-pointer"
    >
      <BellIcon className="h-5 w-5 text-gray-600 ms:h-6 ms:w-6" />
      <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500 ms:h-2 ms:w-2 " />
    </button>
  );
};

export default NotificationIcon;
