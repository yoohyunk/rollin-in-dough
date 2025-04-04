"use client";
import React, { useState, useEffect, useRef } from "react";
import CookieCard, { CookieProduct } from "../../cookies";
import { getAuth } from "firebase/auth";
import {
  addItemToCart,
  deleteItemFromCart,
  getAllItemsFromCart,
  syncLocalCartWithFirestore,
  updateCartItemQuantity,
} from "@/firebase/cart";

export default function MenuPage() {
  const [cookieProducts, setCookieProducts] = useState<CookieProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const hasLoadedCart = useRef(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid || null;

  interface CartItem {
    product: CookieProduct;
    quantity: number;
  }
  interface LocalCartItem {
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

  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const res = await fetch("/api/get-catalog", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log("Catalog response in shop:", data);
        setCookieProducts(data);
      } catch (error) {
        console.error("Error fetching catalog items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogItems();
  }, []);

  const handleAddToCart = async (product: CookieProduct, quantity: number) => {
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
      await addItemToCart(
        {
          productId: product.id,
          variationId: product.variationId,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
        },
        updatedCart.find((item) => item.product.id === product.id)!.quantity
      );
    }
  };

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
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

  useEffect(() => {
    const loadUserCart = async () => {
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
            const parsed = JSON.parse(localCart);

            const restoredCart: LocalCartItem[] = parsed.map(
              (item: LocalCartItem) => ({
                product: {
                  id: item.product.id,
                  variationId: item.product.variationId || "",
                  name: item.product.name,
                  price: item.product.price,
                  imageUrl: item.product.imageUrl || "",
                  description: "",
                },
                quantity: item.quantity,
              })
            );
            setCartItems(restoredCart);
          } catch (e) {
            console.error("Failed to parse local cart:", e);
          }
        }
      }

      hasLoadedCart.current = true; // ✅ mark loaded
    };

    loadUserCart();
  }, [userId]);

  useEffect(() => {
    if (!userId && hasLoadedCart.current && cartItems.length > 0) {
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
  }, [cartItems, userId]);

  useEffect(() => {
    const syncCartAfterLogin = async () => {
      if (!userId) return;

      const localCart = localStorage.getItem("localCart");
      if (!localCart) return;

      try {
        const parsed = JSON.parse(localCart);
        const cartItemsToSync = parsed.map((item: LocalCartItem) => ({
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

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Cookies</h1>
        {isLoading && <p>Loading...</p>}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart section */}
          <div
            className={`lg:w-1/3 ${cartItems.length === 0 ? "lg:hidden" : ""}`}
          >
            {cartItems.length > 0 && (
              <div className="sticky top-24 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.product.name}</span>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 bg-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t pt-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    $
                    {cartItems
                      .reduce(
                        (total, item) =>
                          total + item.product.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <button
                  className="mt-4 w-full bg-[#fc3296] text-white py-2 px-4 rounded hover:bg-[#fbdb8a] hover:text-[#fc3296] transition-colors duration-300"
                  onClick={() => alert("Proceed to checkout!")}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>

          {/* Cookie grid section */}
          <div className={`${cartItems.length > 0 ? "lg:w-2/3" : "w-full"}`}>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {cookieProducts.map((product) => (
                <CookieCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
