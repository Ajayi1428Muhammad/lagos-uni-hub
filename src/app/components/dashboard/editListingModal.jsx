"use client";
import React from "react"
import { editListing } from "@/app/actions/listings";
import { toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const EditListingModal = ( { listing, onClose }  ) =>{
    const router =useRouter() 
    const [isLoading, setIsLoading] = React.useState(false)
        const [formData, setFormData] = React.useState({
            id: listing.id,
            title: listing.title,
            price: listing.price,
            stock: listing.stock,
            description: listing.description,
        })
        const handleChange = ( e ) =>{
            const { name, value } = e.target
            setFormData ((prev) => ({
                ...prev,
                [name]: value,
            }))
          }
        const handleSave = async () => {
            setIsLoading(true)
            try {
                await editListing(formData)
                toast.success("Listing updated successfully!");
            }
            catch (error) {
                toast.error("Failed to update listing. Please try again.");
                console.error("Error updating listing:", error);
            }
            finally {
                setIsLoading(false)
            }
            router.refresh()
            onClose()
        }
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { 
                onClose();
             }
        });

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm-p-6 bg-black/50"
        onClick={onClose}
      >
        <div
          className="bg-slate-200  p-4 mt-2 rounded-xl min-w-[calc(100%-4rem)] max-h-[calc(100%-4rem)] mx-auto ms:min-w-sm overflow-y-auto no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end ">
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 rounded p-1.5 bg-gray-100 hover:scale-[1.1] transition-all duration-200 cursor-pointer"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <h2 className="text-emerald-600 font-bold mb-3 ">
            Edit Listing for{" "}
            <span className="text-emerald-800">({listing.title})</span>
          </h2>
          <div className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-14 rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                Price (₦)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full h-14 rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
              />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full h-14 rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-14 rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
              />
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              onClick={handleSave}
              className="flex w-full h-14 items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-5 py-4 mx-auto text-base font-bold text-white shadow-emerald-200 transition-all duration-200 hover:bg-emerald-700 active:scale-[0.99] max-w-md cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
}
export default EditListingModal