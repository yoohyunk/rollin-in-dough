"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { getAuth } from "firebase/auth";
import {
  addItemToCart,
  deleteItemFromCart,
  getAllItemsFromCart,
  syncLocalCartWithFirestore,
  updateCartItemQuantity,
  clearCart as firebaseClearCart,
} from "@/firebase/cart";
import type { CookieProduct } from "../cookies";

// ----------------------
// Types and Interfaces
// ----------------------
export interface CartItem {
  product: CookieProduct;
  quantity: number;
}

export interface LocalCartItem {
  product: {
    id: string;
    variationId: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
  };
  quantity: number;
}

// ----------------------
// Custom Hook: useCart
// ----------------------
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const hasLoadedCart = useRef(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid || null;

  // Load cart from Firestore (if logged in) or from localStorage
  const loadCart = async () => {
    if (userId) {
      const cart = await getAllItemsFromCart();
      const formattedCart = cart.map((item) => ({
        product: {
          id: item.productId,
          variationId: item.variationId || "",
          name: item.name,
          price: item.price,
          imageUrl: item.image || "",
          description: "",
        },
        quantity: item.quantity,
      }));
      setCartItems(formattedCart);
    } else {
      const localCart = localStorage.getItem("localCart");
      if (localCart) {
        try {
          const parsed: LocalCartItem[] = JSON.parse(localCart);
          const restoredCart = parsed.map((item) => ({
            product: {
              id: item.product.id,
              variationId: item.product.variationId || "",
              name: item.product.name,
              price: item.product.price,
              imageUrl: item.product.imageUrl || "",
              description: "",
            },
            quantity: item.quantity,
          }));
          setCartItems(restoredCart);
        } catch (e) {
          console.error("Failed to parse local cart:", e);
        }
      }
    }
    hasLoadedCart.current = true;
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  // Save the cart to localStorage for non-logged in users.
  // This effect updates localStorage only if there are items in the cart.
  useEffect(() => {
    if (!userId && hasLoadedCart.current) {
      if (cartItems.length > 0) {
        const simplifiedCart = cartItems.map((item) => ({
          product: {
            id: item.product.id,
            variationId: item.product.variationId || "",
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.imageUrl,
          },
          quantity: item.quantity,
        }));
        localStorage.setItem("localCart", JSON.stringify(simplifiedCart));
      }
    }
  }, [cartItems, userId]);

  // Sync the local cart with Firestore when the user logs in
  useEffect(() => {
    const syncCartAfterLogin = async () => {
      if (!userId) return;
      const localCart = localStorage.getItem("localCart");
      if (!localCart) return;
      try {
        const parsed: LocalCartItem[] = JSON.parse(localCart);
        const cartItemsToSync = parsed.map((item) => ({
          productId: item.product.id,
          variationId: item.product.variationId || "",
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.imageUrl || "",
        }));
        await syncLocalCartWithFirestore(cartItemsToSync);
        localStorage.removeItem("localCart");
      } catch (err) {
        console.error("Error syncing local cart after login:", err);
      }
    };

    syncCartAfterLogin();
  }, [userId]);

  // Add product to cart
  const addToCart = async (product: CookieProduct, quantity: number) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === product.id
    );
    const updatedCart = [...cartItems];

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ product, quantity });
    }
    setCartItems(updatedCart);

    if (userId) {
      const newQuantity = updatedCart.find(
        (item) => item.product.id === product.id
      )!.quantity;
      await addItemToCart(
        {
          productId: product.id,
          variationId: product.variationId,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
        },
        newQuantity
      );
    }
  };

  // Update the quantity or remove an item if quantity is zero
  const updateQuantity = async (productId: string, newQuantity: number) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === productId
    );
    if (existingIndex < 0) return;

    if (newQuantity === 0) {
      const confirmed = window.confirm(
        "Are you sure you want to remove this item from your cart?"
      );
      if (confirmed) {
        setCartItems(cartItems.filter((item) => item.product.id !== productId));
        if (userId) await deleteItemFromCart(productId);
      }
    } else {
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity = newQuantity;
      setCartItems(updatedCart);
      if (userId) await updateCartItemQuantity(productId, newQuantity);
    }
  };

  // ----------------------
  // UPDATED: Clear cart function
  // ----------------------
  const clearCartLocal = async () => {
    if (userId) {
      await firebaseClearCart();
    } else {
      localStorage.removeItem("localCart");
    }
    setCartItems([]);
  };

  return {
    cartItems,
    addToCart,
    updateQuantity,
    clearCart: clearCartLocal,
  };
}

// ----------------------
// Cart Context Setup
// ----------------------
interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (product: CookieProduct, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { cartItems, addToCart, updateQuantity, clearCart } = useCart();
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
