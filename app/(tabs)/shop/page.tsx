// MenuPage.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import CookieCard, { CookieProduct } from "../../../components/cookies";
import { useCart } from "@/app/Context/CartContext"; // Adjust the import path as needed

export default function MenuPage() {
  const [cookieProducts, setCookieProducts] = useState<CookieProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { cartItems, displayCart, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const res = await fetch("/api/get-catalog", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setCookieProducts(data);
      } catch (error) {
        console.error("Error fetching catalog items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogItems();
  }, []);
  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, cartItem) => {
      // Find the matching detailed item from displayCart using product id
      const detailedItem = displayCart.find(
        (item) => item.product.id === cartItem.product.id
      );
      return detailedItem
        ? total + detailedItem.product.price * cartItem.quantity
        : total;
    }, 0);
  }, [cartItems, displayCart]);

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
                  {displayCart.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.product.name}</span>
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(
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
                              updateQuantity(item.product.id, item.quantity + 1)
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
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
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

          {/* Catalog grid section */}
          <div className={`${cartItems.length > 0 ? "lg:w-2/3" : "w-full"}`}>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {cookieProducts.map((product) => (
                <CookieCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
