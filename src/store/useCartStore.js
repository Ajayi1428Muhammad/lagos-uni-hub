import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) =>({
            cart: [],
            increaseQuantity: (listing) =>{
                set((state) => {
                    const existingItem = state.cart.find((item)=> item.id === listing.id)
                    const maxStock = listing.stock ?? 1;
                    if(existingItem){
                        if(existingItem.quantity>= maxStock ){
                            return state;
                        }
                        return {
                            cart: state.cart.map((item)=>item.id === listing.id ? {...item, quantity: item.quantity + 1} : item)
                        }
                    }
                    const newItem = {
                        id: listing.id,
                        title: listing.title,
                        description: listing.description,
                        price: listing.price,
                        mediaUrls: listing.mediaUrls?.[0] ?? null,
                        quantity: 1,
                        brand: listing.user?.name,
                        selected: true,
                    }
                    return {
                        cart: [...state.cart, newItem]
                    }
                })
            },
            decreaseQuantity: (id) =>{
                set((state) => {
                    const existingItem = state.cart.find((item) => item.id === id)
                    if(!existingItem) return state;
                    if (existingItem.quantity === 1){
                        return {
                            cart: state.cart.filter((item) => item.id !== id)
                        }
                    };
                    return {
                        cart: state.cart.map((item) => item.id === id ? {...item, quantity: item.quantity - 1 } : item)
                    }
                })
            },
            removeItem: (id) => {
                set((state) => {
                    return {
                        cart: state.cart.filter((item) => item.id !== id )
                    }
                })
            },
            toggleItemSelect: (id) =>{
                set((state) => {
                    return {
                        cart: state.cart.map((item) => item.id === id ? {...item, selected: !item.selected} : item)
                    }
                })
            },
            toggleSelectAll: () => {
                set((state) => {
                    const allSelected = state.cart.every((item) => item.selected)
                    return{
                        cart: state.cart.map((item) => ({...item, selected: !allSelected}) )
                    }
                })
            },
            getItemQuantity: (id) =>{
               const item = get().cart.find((item) => item.id === id)
               return item ? item.quantity : 0
            },
            getItemTotalPrice: (id) =>{
                const item = get().cart.find((item) => item.id === id)
                return item ? item.price * item.quantity : 0
            },
            getSelectedTotalPrice: () => {
                return get().cart
                .filter((item) => item.selected)
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
            },
            getSelectedCount:() => {
                return get().cart
                .filter((item) => item.selected)
                .reduce((count, item) => item.quantity + count, 0)
            },
             isAllSelected: () => {
                const cart = get().cart
                return cart.length > 0 && cart.every((item) => item.selected)
             },
             getTotalCartCount: () => {
                return get().cart.reduce((count, item) => item.quantity + count, 0)
            }
        })
    )
)