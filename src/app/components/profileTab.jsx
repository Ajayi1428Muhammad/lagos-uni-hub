"use client"
import { useState } from "react";
import Card from "@/app/components/card";
import { Grid, Bookmark, Contact2, PlaySquare } from "lucide-react";
import { div } from "framer-motion/client";

export default function ProfileTabs({ listings }) {
   const [activeTab, setActiveTab] = useState("listings");
   const tabs = [
     { id: "listings", label: "Your listings", icon: Grid },
     { id: "video", label: "Video", icon: PlaySquare },
     { id: "savedItem", label: "Saved items", icon: Bookmark },
     { id: "notifications", label: "notifications", icon: Contact2 },
   ];

   const isVideoItem = (item) =>{
    if(item.type === "video" || item.resourceType === "video") return true;
    const firstUrl = item.mediaUrls?.[0] || "";
    return /\.(mp4|webm|mov|mkv|avi)($|\?)/i.test(firstUrl);
   }

   const photoListings = listings.filter( item => !isVideoItem(item)); 
   const videoListings = listings.filter( item => isVideoItem(item));

  return (
    <div className="w-full">
      {/* Tab Navigation Line */}
      <div className="relative border-t border-gray-200">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-4 relative cursor-pointer group transition-colors duration-200
                  ${isActive ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Icon className="w-6 h-6 text-black transition-transform duration-200 group-hover:scale-110 " />
              </button>
            );
          })}
        </div>

        {/* Sliding Indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-black transition-all duration-300 ease-out"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${tabs.findIndex((t) => t.id === activeTab) * 100}%)`,
          }}
        />
      </div>
      <div className="mb-4">
        <hr className="text-gray-300" />
      </div>

      {/* Tab Content Display */}
      <div className="mt-6">
        {activeTab === "listings" && (
          <div id="listings">
            {photoListings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                You haven't posted any items yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                {photoListings.map((listing) => (
                  <Card key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "video" && (
          <div id="video">
            {videoListings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                You haven't posted any videos yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                {videoListings.map((listing) => (
                  <Card key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "savedItem" && (
          <div id="savedItem" className="text-center py-10 text-gray-400">
            Saved Item
          </div>
        )}
        {activeTab === "notifications" && (
          <div id="notifications" className="text-center py-10 text-gray-400">
            Notifications and settings
          </div>
        )}
      </div>
    </div>
  );
}
