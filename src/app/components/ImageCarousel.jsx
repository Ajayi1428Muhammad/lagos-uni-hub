"use client"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useState, useRef, useEffect } from "react"

const ImageCarousel = ({ listing }) => {
  const rawMediaUrls = listing.mediaUrls ?? [];
  const formattedMediaUrls = rawMediaUrls.map((url) => {
    const cleanUrl = url.toLowerCase()
    const cloudUrl = cleanUrl.includes("/video/upload")
    const mediaUrl = typeof url === "string" &&
  /\.(mp4|mov|webm|mkv|avi|m4v)(\?.*)?$/i.test(url);
    const isVideo = cloudUrl || mediaUrl
  return {
    url: url,
    type: isVideo ? "video" : "image"
  }
})
  

  const [selectedIndex, setSelectedIndex] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [overlaySlideIndex, setOverlaySlideIndex] = useState(0)
  //Refs
  const inlineVideosRef = useRef([]);
  const overlayVideosRef = useRef([]);
  const slideRefs = useRef([]);
  const slideOpenRef = useRef([])

  //Observers
  useEffect(() => {
    const slides = slideRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 },
    );
    slides.forEach((slide) => {
      if (slide) observer.observe(slide);
    });
    return () => observer.disconnect();
  }, [formattedMediaUrls.length]);

  useEffect(()=>{
    if(selectedIndex === null) return
    const slideOverlay = slideOpenRef.current;
    const observer = new IntersectionObserver(
      (entries)=>{
        entries.forEach((entry)=>{
          if(entry.isIntersecting){
            const index = Number(entry.target.getAttribute('data-index'))
            setOverlaySlideIndex(index)
          }
        })
      },
      {threshold: 0.6}
    )
    slideOverlay.forEach((slide)=>{
      if(slide){
        observer.observe(slide)
      }
    })
    return () => observer.disconnect();
  }, [selectedIndex,formattedMediaUrls.length])
  
  //handling esc key and scrolling to selected slide
  useEffect(() => {
    if (selectedIndex !== null && slideOpenRef.current[selectedIndex]) {
      slideOpenRef.current[selectedIndex].scrollIntoView({
        behavior: "instant",
        block: "nearest",
        inline: "center",
      });
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };
    if(selectedIndex !== null) {
    window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedIndex]);
  
  // Pause inline videos when not active and modal open
  useEffect(()=>{
    inlineVideosRef.current.forEach((video, index) => {
      if(video && index !== activeIndex || selectedIndex !== null){
        if(typeof video?.pause === "function"){
          video.pause()
        }
      }
    })
  }, [selectedIndex, activeIndex]) 

// pause when overlay is closed and unactive slide
  useEffect(()=>{
    overlayVideosRef.current.forEach((video, index)=>{
      if(video && index !== selectedIndex){
        video.pause()
      }
      if(index !== overlaySlideIndex || selectedIndex === null){
        if(typeof video?.pause === "function"){
          video.pause()
        }
      }
        inlineVideosRef.current.forEach((video) => {
          video?.pause();
        });
    })
  }, [selectedIndex, overlaySlideIndex]) 
  
  return (
    <>
      <div className="relative flex overflow-x-auto gap-1 no-scrollbar snap-mandatory snap-x h-120 sm:max-h-125 overflow-y-hidden ">
        {formattedMediaUrls.map((item, index) => (
          <div
            key={index}
            data-index={index}
            ref={(el) => (slideRefs.current[index] = el)}
            onClick={(e) => {
              setSelectedIndex(index);
              e.preventDefault();
              if (item.type === "video") {
                const videoEl = overlayVideosRef.current[index];
                if (typeof videoEl?.pause === "function") {
                  videoEl.pause();
                }
              }
            }}
            className="flex gap-1 h-full w-full justify-center shrink-0 snap-start bg-slate-200 cursor-pointer rounded-lg"
          >
            {item.type === "video" ? (
              <video
                src={item.url}
                ref={(el) => (inlineVideosRef.current[index] = el)}
                controls
                playsInline
                preload="metadata"
                className="object-contain "
              />
            ) : (
              <Image
                src={item.url}
                alt="Profile"
                width={400}
                height={250}
                className="object-contain"
              />
            )}
          </div>
        ))}
      </div>
      <div>
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-50 flex bg-white backdrop:blur-lg">
            <div
              className="flex justify-end p-4"
              onClick={() => setSelectedIndex(null)}
            >
              <button
                type="button"
                className="absolute rounded-full bg-slate-200 p-3 transition-all hover:bg-slate-300 cursor-pointer top-4 right-4 z-60"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="no-scrollbar flex flex-1 p-10  w-full h-full snap-x snap-mandatory overflow-x-auto scroll-smooth ">
              {formattedMediaUrls.map((item, index) => (
                <div
                  key={index}
                  data-index={index}
                  ref={(el) => (slideOpenRef.current[index] = el)}
                  className="relative h-full w-full min-w-full shrink-0 snap-start p-4 mx-auto flex items-center justify-center"
                >
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      ref={(el) => (overlayVideosRef.current[index] = el)}
                      controls
                      playsInline
                      preload="metadata"
                      className="object-contain w-auto h-auto max-h-[85vh] mx-auto rounded-xl max-w-full touch-manipulation focus:outline-none"
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={`Full size view ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ImageCarousel
