// store/cartStore.js
import { create } from "zustand";


// Interface sederhana untuk item keranjang
// interface CartItem {
//   productId: number;
//   quantity: number;
//   title: string;
//   price: number;
// }

export const useCartStore = create((set) => ({
  // State Awal
  items: [],

  _hasHydrated: false,

  setHasHydrated: (state) => set({ _hasHydrated: state }),

  // Actions
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.productId === product.productId
      );
      let newItems;

      if (existingItem) {
        // Jika sudah ada, tambahkan kuantitas
        newItems = state.items.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        // Jika belum ada, tambahkan item baru
        newItems = [...state.items, product];
      }

      // 💾 Simpan ke LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(newItems));
      }

      if (state._hasHydrated) {
        localStorage.setItem('cartItems', JSON.stringify(newItems));
      }
      return { items: newItems };
    }),

  // Tambahkan fungsi lain (removeItem, updateQuantity, dll.)
  getTotalItems: () =>
    useCartStore
      .getState()
      .items.reduce((total, item) => total + item.quantity, 0),

  setHasHydrated: (state) => set({ _hasHydrated: state }),
}));
