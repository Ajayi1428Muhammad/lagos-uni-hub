"use client";
import Link from "next/link";
import { Square2StackIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { PlusIcon as PlusSolid } from "@heroicons/react/24/solid";

const Footer = () => {
  const pathname = usePathname();
  const items = [
    {
      label: "listings",
      href: "/",
      icon: Square2StackIcon,
    },
    {
      label: "sell",
      href: "/sell",
      icon: PlusSolid,
    },
    {
      label: "affiliates",
      href: "/affiliates",
      icon: ChartBarIcon,
    },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <footer className="flex fixed bottom-0 h-17 items-center justify-between border-t border-green-200 w-full bg-white mx-auto px-4 ">
      
      {items.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);

        return (
          <Link
            key={label}
            aria-label={label}
            href={href}
            className="group flex flex-col items-center justify-center gap-1 h-full max-h-[calc(100%-1px)] my-auto mx-auto"
          >
            <div
              className={
                active
                  ? "flex flex-col items-center justify-center gap-1 h-full max-h-[calc(100%-1px)] my-auto mx-auto"
                  : "flex flex-col items-center justify-center gap-1 h-full max-h-[calc(100%-1px)] my-auto mx-auto transition-colors duration-200"
              }
            >
              <span
                className={
                  active
                    ? "flex h-11 w-11 mx-auto items-center justify-center rounded-xl bg-emerald-500  text-white shadow-sm shadow-emerald-200"
                    : "flex h-11 w-11 mx-auto items-center justify-center rounded-xl text-gray-400 transition-colors duration-200 group-hover:bg-emerald-600 group-hover:text-white"
                }
              >
                <Icon className="h-6 w-6" />
              </span>
              {active ? (
                <span className="text-[11px] font-medium uppercase leading-none text-emerald-300">
                  {label}
                </span>
              ) : (
                <span className="text-[11px] font-medium uppercase leading-none text-gray-400 transition-colors duration-200 group-hover:text-emerald-300">
                  {label}
                </span>
              )}
            </div>
          </Link>
        );
      })}
      {/* </div> */}
    </footer>
  );
};

export default Footer;
