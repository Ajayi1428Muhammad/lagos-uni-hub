"use client"
import React, { useState, useRef, useEffect } from 'react'
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import {ArrowRightIcon, ChevronRightIcon, ShoppingCartIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import StarIconComponent from '@/app/listings/[id]/StarIcon';
import { button } from 'framer-motion/client';
import getTime from '@/lib/formatDate';

const ListingDetails = ({ listing }) => {
  const description = listing.description ?? "No description available";
  const title = listing.title ?? "No title available";
  const price = listing.price ?? 0;
  const brand = listing.user?.name ?? "Unknown Brand";
  const timeCreated = listing.createdAt;
  const timestamp = getTime(timeCreated);

  const options = { month: "short", day:"numeric", year:"numeric",};
  const timeTest = new Date(timeCreated).toLocaleString();
  
  const formatPrice = (val) => {
    if (!val && val !== 0) return "";
    const n = Number(val);
    if (Number.isNaN(n)) return val;
    return `${n.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}`;
  };
  const [isOpen, setIsOpen] =useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Choose a location");
  const locations = [
    "Arcade",
    "Faculty of Engineering",
    "Library",
    "Cafeteria",
  ];
  const dropdownRef = useRef(null)
  useEffect(()=>{
    const handleClickOutside = (event) => {
      if(dropdownRef.current && !dropdownRef.current.contains(event.target))
        {setIsOpen(false)}
    }
    document.addEventListener("mousedown", handleClickOutside)
    return ()=> document.removeEventListener("mousedown", handleClickOutside) 
    
  },[])
  return (
    <div className="relative bg-slate-200 h-120 rounded-lg p-4 py-6 overflow-y-auto">
      <button className="absolute top-6 right-2 p-2.5 rounded-full bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all border border-white/20 cursor-pointer">
        <HeartIconSolid className="h-3.5 w-3.5 text-slate-900" />
      </button>
      <div className="font-bold text-lg mb-2">{title}</div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-1">
          <div className="text-sm text-slate-600">{brand} </div>
          <ChevronRightIcon className="h-4 w-4 " />
        </div>
        <div className="text-xs text-slate-600 capitalize">{timestamp}</div>
      </div>
      <div className="text-lg font-bold">{formatPrice(price)}</div>
      <div className="text-sm text-slate-600">0 Units left</div>
      <div className="flex flex-col  gap-1 mt-2 mb-4">
        <p>Reviews:</p>
        <StarIconComponent />
      </div>
      <div>
        Delivery details: <br />
        Shipping from N500 to Arcade
      </div>
      <div className="relative mt-2 " ref={dropdownRef}>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 cursor-pointer text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <span>{selectedLocation}</span>
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-slate-300 rounded-2xl border border-slate-300 shadow-lg z-20 overflow-hidden">
            {locations.map((location) => (
              <button
                type="button"
                key={location}
                className="block px-4 py-2 text-left text-sm font-semibold "
                onClick={() => {
                  setSelectedLocation(location);
                  setIsOpen(false);
                }}
              >
                {location}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between px-5  absolute bottom-0 left-0 right-0 mb-4 ">
        <div className="bg-emerald-600 p-4 rounded-lg font-bold">Buy Now</div>
        <div className="flex items-center p-4 rounded-lg gap-1 bg-emerald-600">
          <ShoppingCartIcon className="h-4 w-4 " />
          <div className="font-bold  ">Add to Cart </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails
