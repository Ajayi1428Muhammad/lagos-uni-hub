"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = ["Gadgets", "Book", "Fashion", "Skincare"];
  const universities = [
    "All Campuses",
    "Unilag",
    "LASU",
    "Lasued",
    "Lasutech",
    "Caleb",
  ];
  const [selectedUniversity, setSelectedUniversity] = useState("All Campuses");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-5">
      <div className="flex flex-col justify-start  items-start gap-6">
        <div className="">
          <div className="text-[30px] mb-2 ">Campus Marketplace</div>

          <p className="text-sm ">Buy and sell within the community.</p>
        </div>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <MapPinIcon className="h-4 w-4" />
            <span>{selectedUniversity}</span>
            {dropdownOpen ? <ChevronUpIcon className="h-4 w-4" />: <ChevronDownIcon className="h-4 w-4" />}
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-100">
              {universities.map((university) => (
                <button
                  key={university}
                  type="button"
                  onClick={() => {
                    setSelectedUniversity(university);
                    setDropdownOpen(false);
                    const params = new URLSearchParams(searchParams.toString());
                    if(university === "All Campuses") {
                      params.delete("university");
                    } else {
                      params.set("university", university);
                    }
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    selectedUniversity === university
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {university}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Link href="/sell">
        <button className="flex w-full items-center justify-center gap-2 bg-linear-to-br from-emerald-600 to-emerald-700 text-white font-bold text-base tracking-widest px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-px  transition-all active:scale-95 mt-5 border border-emerald-500/20 cursor-pointer">
          <PlusIcon className="h-5 w-5 stroke-3" />
          <span>Start Selling</span>
        </button>
      </Link>
      <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar ">
        <button
          onClick={() => router.push("/")}
          className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-sm cursor-pointer ${
            !searchParams.get("category")
              ? "bg-emerald-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
          }`}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => router.push(`/?category=${category}`)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-sm cursor-pointer ${
              searchParams.get("category") === category
                ? "bg-emerald-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
            }`}
          >
            {category}
          </button>
        ))}
        <button className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold whitespace-nowrap hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-sm cursor-pointer">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;
