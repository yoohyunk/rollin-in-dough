"use client";
import React, {
  createContext,
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
import type { CookieProduct } from "../../components/cookies";
import { CartItem, DisplayCartItem } from "@/types/customerData";

type GetItemResponse = { items: CookieProduct[] };

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [displayCart, setDisplayCart] = useState<DisplayCartItem[]>([]);
  const hasLoadedCart = useRef(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid || null;

  useEffect(() => {
    let cartItemIds: string[] = [];
    let loadedCartItems: CartItem[] = [];

    const loadCart = async () => {
      if (userId) {
        const syncCartAfterLogin = async () => {
          if (!userId) return;
          const localCart = localStorage.getItem("localCart");
          if (!localCart) return;
          try {
            const parsed: CartItem[] = JSON.parse(localCart);
            // const cartItemsToSync = parsed.map((item) => ({
            //   productId: item.product.id,
            //   variationId: item.product.variationId || "",
            //   quantity: item.quantity,
            // }));
            await syncLocalCartWithFirestore(parsed);
            // localStorage.removeItem("localCart");
          } catch (err) {
            console.error("Error syncing local cart after login:", err);
          }
        };

        await syncCartAfterLogin();
        const cart = await getAllItemsFromCart();
        console.log("FS cart", cart);
        loadedCartItems = cart;
        cartItemIds = cart.map((item) => item.product.id);

        console.log("Cart item ids from Firestore:", cartItemIds);
        // also update with local cart data
        // loadedCartItems[0].quantity = localSorage[0] ? localSorage[0].quantity : loadedCartItems[0].quantity
        // setCart(loadedCartItem)
      } else {
        const localCart = localStorage.getItem("localCart");
        if (localCart) {
          try {
            const parsed: CartItem[] = JSON.parse(localCart);
            loadedCartItems = parsed;
            setCartItems(parsed);
            cartItemIds = parsed.map((item) => item.product.id);
          } catch (e) {
            console.error("Failed to parse local cart:", e);
            return;
          }
        }
      }

      const response = await fetch(
        `/api/get-item?objectIds=${cartItemIds.join(",")}`,
        {
          method: "GET",
        }
      );
      const data = (await response.json()) as GetItemResponse;
      const { items } = data;
      const formattedCart = items.map((item: CookieProduct) => {
        const matchingCartItem = loadedCartItems.find(
          // <--- Use loadedCartItems instead of cartItems
          (cartItem) => cartItem.product.id === item.id
        );
        return {
          product: {
            id: item.id,
            variationId: item.variationId || "",
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            description: item.description,
          },
          quantity: matchingCartItem ? matchingCartItem.quantity : 1,
        };
      });
      setDisplayCart(formattedCart);
      hasLoadedCart.current = true;
    };

    loadCart();
  }, [userId]);

  // Save the cart to localStorage for non-logged in users.
  // This effect updates localStorage only if there are items in the cart.
  useEffect(() => {
    if (!userId && hasLoadedCart.current) {
      if (cartItems.length >= 0) {
        const simplifiedCart = cartItems.map((item) => ({
          product: {
            id: item.product.id,
            variationId: item.product.variationId || "",
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
        const parsed: CartItem[] = JSON.parse(localCart);
        // const cartItemsToSync = parsed.map((item) => ({
        //   productId: item.product.id,
        //   variationId: item.product.variationId || "",
        //   quantity: item.quantity,
        // }));
        await syncLocalCartWithFirestore(parsed);
        // localStorage.removeItem("localCart");
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
      setDisplayCart((prev) =>
        prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      updatedCart.push({ product, quantity });
      const response = await fetch(`/api/get-item?objectIds=${product.id}`, {
        method: "GET",
      });
      const data = (await response.json()) as GetItemResponse;
      const { items } = data;
      const item = items[0];
      const formattedCart = {
        product: {
          id: item.id,
          variationId: item.variationId || "",
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          description: item.description,
        },
        quantity: quantity,
      };
      setDisplayCart([...displayCart, formattedCart]);
    }
    setCartItems(updatedCart);

    if (userId) {
      const newQuantity = updatedCart.find(
        (item) => item.product.id === product.id
      )!.quantity;
      const itemToAdd = {
        product: {
          id: product.id,
          variationId: product.variationId,
        },
        quantity: newQuantity,
      };

      await addItemToCart(itemToAdd);
    } else {
      const localCart = localStorage.getItem("localCart");
      if (localCart) {
        try {
          const parsed: CartItem[] = JSON.parse(localCart);
          const existingLocalIndex = parsed.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingLocalIndex >= 0) {
            parsed[existingLocalIndex].quantity += quantity;
          } else {
            parsed.push({
              product: { id: product.id, variationId: product.variationId },
              quantity,
            });
          }
          localStorage.setItem("localCart", JSON.stringify(parsed));
        } catch (e) {
          console.error("Failed to parse local cart:", e);
        }
      } else {
        localStorage.setItem(
          "localCart",
          JSON.stringify([
            {
              product: { id: product.id, variationId: product.variationId },
              quantity,
            },
          ])
        );
      }
    }
  };

  // Update the quantity or remove an item if quantity is zero
  const updateQuantity = async (productId: string, newQuantity: number) => {
    alert(`${productId} ${newQuantity}`);
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
        if (userId) {
          await deleteItemFromCart(productId);
        }
        setDisplayCart((prev) =>
          prev.filter((item) => item.product.id !== productId)
        );
        // const localStorageCart = JSON.parse(localStorage.get("localCart"));
        // window.localStorage.set(
        //   "localCart",
        //   JSON.stringify(
        //     localStorageCart.filter(
        //       (item: CartItem) => item.product.id !== productId
        //     )
        //   )
        // );
      }
    } else {
      const updatedCart = [...cartItems]; // copy by value = `updatedCart` has different memory address than `cartItems`
      updatedCart[existingIndex].quantity = newQuantity;
      setCartItems(updatedCart);
      if (userId) {
        await updateCartItemQuantity(productId, newQuantity);
      }
      setDisplayCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

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
    displayCart,
    addToCart,
    updateQuantity,
    clearCart: clearCartLocal,
  };
}

interface CartContextValue {
  cartItems: CartItem[];
  displayCart: DisplayCartItem[];
  addToCart: (product: CookieProduct, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { cartItems, displayCart, addToCart, updateQuantity, clearCart } =
    useCart();
  return (
    <CartContext.Provider
      value={{ cartItems, displayCart, addToCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
