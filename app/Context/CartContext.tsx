"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  addItemToCart,
  getAllItemsFromCart,
  deleteItemFromCart,
  clearCart,
  syncLocalCartWithFirestore,
} from "@/firebase/cart";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeItem: (productId: string) => void;
  clearCartItems: () => void;
  syncWithFirestore: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCartItems: () => {},
  syncWithFirestore: async () => {},
  isLoading: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart data from Firestore if loged in if not local storage
  useEffect(() => {
    const loadCart = async () => {
      if (userId) {
        setIsLoading(true);
        try {
          const items = await getAllItemsFromCart(userId);
          setCartItems(items);
        } finally {
          setIsLoading(false);
        }
      } else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) setCartItems(JSON.parse(savedCart));
      }
    };
    loadCart();
  }, [userId]);

  // Save the cart to localStorage if the user is logged out
  useEffect(() => {
    if (!userId) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  // Add
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (i) => i.productId === item.productId
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + item.quantity,
        };
        return newCart;
      } else {
        return [...prev, item];
      }
    });

    if (userId) {
      addItemToCart(userId, item);
    }
  };

  // Update
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return removeItem(productId);

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    if (userId) {
      try {
        const q = query(
          collection(db, "users", userId, "cart"),
          where("productId", "==", productId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          await updateDoc(snapshot.docs[0].ref, {
            quantity: newQuantity,
          });
        }
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };

  // Remove
  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    deleteItemFromCart(userId, productId);
  };

  // Clear
  const clearCartItems = () => {
    setCartItems([]);
    if (userId) {
      clearCart(userId);
    }
  };

  // Sync
  const syncWithFirestore = async (newUserId: string) => {
    if (!newUserId) return;

    setIsLoading(true);
    setUserId(newUserId);

    try {
      // Sync the local cart to firestore database
      const updatedCart = await syncLocalCartWithFirestore(
        newUserId,
        cartItems
      );
      setCartItems(updatedCart);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error syncing cart with Firestore:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCartItems,
        syncWithFirestore,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
