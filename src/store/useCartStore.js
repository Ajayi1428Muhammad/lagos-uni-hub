import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      increaseQuantity: async (listingOrId) => {
        const isObject =
          typeof listingOrId === "object" && listingOrId !== null;
        const targetId = isObject ? listingOrId.id : listingOrId;
        const listing = isObject ? listingOrId : null;

        if (listing) {
          const rawPrice = listing.price ?? 0;
          const numericPrice =
            typeof rawPrice === "string"
              ? parseFloat(rawPrice.replace(/[^0-9.]/g, ""))
              : Number(rawPrice) || 0;

          set((state) => {
            const existingItem = state.cart.find(
              (item) => item.id === targetId,
            );
            const stockLimit = Number(listing.stock ?? 1);

            if (existingItem && existingItem.quantity >= stockLimit) {
              return state;
            }

            if (existingItem) {
              return {
                cart: state.cart.map((item) =>
                  item.id === targetId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                ),
              };
            }

            const newItem = {
              id: listing.id,
              title: listing.title,
              description: listing.description,
              price: numericPrice,
              mediaUrls: listing.mediaUrls?.[0] ?? null,
              quantity: 1,
              stock: stockLimit,
              brand: listing.user?.name,
              selected: true,
            };

            return {
              cart: [...state.cart, newItem],
            };
          });
          return;
        }

        try {
          const response = await fetch(`/api/listings/${targetId}/stock`);
          const payload = await response.json();
          const currentStock = Number(payload?.stock ?? 0);

          set((state) => {
            const existingItem = state.cart.find(
              (item) => item.id === targetId,
            );
            if (!existingItem) return state;
            if (existingItem.quantity >= currentStock) {
              return state;
            }
            return {
              cart: state.cart.map((item) =>
                item.id === targetId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          });
        } catch (error) {
          console.error(
            "Failed to fetch stock before increasing quantity:",
            error,
          );
        }
      },
      decreaseQuantity: (id) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === id);
          if (!existingItem) return state;
          if (existingItem.quantity === 1) {
            return {
              cart: state.cart.filter((item) => item.id !== id),
            };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            ),
          };
        });
      },
      removeItem: (id) => {
        set((state) => {
          return {
            cart: state.cart.filter((item) => item.id !== id),
          };
        });
      },
      toggleItemSelect: (id) => {
        set((state) => {
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, selected: !item.selected } : item,
            ),
          };
        });
      },
      toggleSelectAll: () => {
        set((state) => {
          const allSelected = state.cart.every((item) => item.selected);
          return {
            cart: state.cart.map((item) => ({
              ...item,
              selected: !allSelected,
            })),
          };
        });
      },
      getItemQuantity: (id) => {
        const item = get().cart.find((item) => item.id === id);
        return item ? item.quantity : 0;
      },
      getItemTotalPrice: (id) => {
        const item = get().cart.find((item) => item.id === id);
        return item ? item.price * item.quantity : 0;
      },
      getSelectedTotalPrice: () => {
        return get()
          .cart.filter((item) => item.selected)
          .reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getSelectedCount: () => {
        return get()
          .cart.filter((item) => item.selected)
          .reduce((count, item) => item.quantity + count, 0);
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => item.quantity + count, 0);
      },
      isAllSelected: () => {
        const cart = get().cart;
        return cart.length > 0 && cart.every((item) => item.selected);
      },
      getTotalCartCount: () => {
        return get().cart.reduce((count, item) => item.quantity + count, 0);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
