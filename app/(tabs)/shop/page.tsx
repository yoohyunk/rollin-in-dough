"use client";
import React, { useState, useEffect } from "react";
import CookieCard, { CookieProduct } from "../../cookies";

export default function MenuPage() {
  const [cookieProducts, setCookieProducts] = useState<CookieProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  interface CartItem {
    product: CookieProduct;
    quantity: number;
  }
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: CookieProduct, quantity: number) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === product.id
    );
    if (existingIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.product.id === productId
    );
    if (existingIndex >= 0) {
      if (newQuantity === 0) {
        const confirmed = window.confirm(
          "Are you sure you want to remove this item from your cart?"
        );
        if (confirmed) {
          setCartItems(
            cartItems.filter((item) => item.product.id !== productId)
          );
        }
      } else {
        const updatedCart = [...cartItems];
        updatedCart[existingIndex].quantity = newQuantity;
        setCartItems(updatedCart);
      }
    }
  };

  return (
    <>
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
    </>
  );
}