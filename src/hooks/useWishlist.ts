"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  _id: string;
  type?: string;
  locality?: string;
  city?: string;
  price?: number;
  bhk?: number;
  images?: string[];
  status?: string;
}

interface WishlistState {
  wishlist: WishlistItem[];
  addToWishlist: (property: WishlistItem) => void;
  removeFromWishlist: (propertyId: string) => void;
  isInWishlist: (propertyId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      
      addToWishlist: (property: WishlistItem) => {
        set((state) => {
          if (state.wishlist.some((item) => item._id === property._id)) {
            return state;
          }
          return { wishlist: [...state.wishlist, property] };
        });
      },
      
      removeFromWishlist: (propertyId: string) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item._id !== propertyId),
        }));
      },
      
      isInWishlist: (propertyId: string) => {
        return get().wishlist.some((item) => item._id === propertyId);
      },
      
      clearWishlist: () => {
        set({ wishlist: [] });
      },
    }),
    {
      name: 'property-wishlist',
    }
  )
);
