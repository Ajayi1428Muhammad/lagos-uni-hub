"use client"
import React from 'react'
import { editListing } from '@/app/actions/listings'
import { toast } from 'react-toastify'
import { redirect } from 'next/navigation'

const EditForm = ( { listing } ) => {
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
        redirect("/dashboard")
    }
    
    return (
      <div className="bg-slate-200 p-4 mt-2 rounded-xl">
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
              className="w-full rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
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
              className="w-full rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
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
              className="w-full rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
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
              className="w-full rounded-2xl pl-3 pr-5 py-2 ms:py-4 text-xs ms:text-sm font-bold focus:ring-2 outline-none border border-slate-400 ring-emerald-500"
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-5 py-4 mx-auto text-base font-bold text-white shadow-emerald-200 transition-all duration-200 hover:bg-emerald-700 active:scale-[0.99] max-w-md cursor-pointer"
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
    );
}

export default EditForm
