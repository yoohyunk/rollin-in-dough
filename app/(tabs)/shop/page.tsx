"use client";
import React, { useState } from "react";
import Image from "next/image";
import CookieCard, { CookieProduct } from "../../cookies";

interface CartItem {
  product: CookieProduct;
  quantity: number;
}

export default function MenuPage() {
  // Mocked cookie products
  const mockedCookieProducts: CookieProduct[] = [
    {
      id: "1",
      name: "Chocolate Chip Cookie",
      price: 2.5,
      description:
        "A classic cookie with gooey chocolate chips. Why mess with a classic",
      imageUrl: "/chocolate-chip.png",
      ingredients: ["Flour", "Sugar", "Chocolate Chips", "Butter"],
      allergens: ["Gluten", "Dairy"],
    },
    {
      id: "2",
      name: "Sugar Cookie",
      price: 2.0,
      description:
        "Let’s add a little whimsy! Have you ever had a frosted Animal Cracker? This is simple & classic— vanilla cookie, vanilla frosting, with a little colourful fun!",
      imageUrl: "/sugar-cookie.png",
      ingredients: ["Oats", "Raisins", "Brown Sugar", "Butter"],
      allergens: ["Gluten", "Dairy"],
    },
    {
      id: "3",
      name: "Nutella loaded coissant",
      price: 2.8,
      description:
        "Loaded Nutella cookie wrapped in a croissant, and finished off with a chocolate-hazelnut ganache, Bueno pieces, and toffee bits. Get ready to be chocolate wasted!",
      imageUrl: "/nutella-croissant.png",
      ingredients: ["Peanut Butter", "Sugar", "Eggs"],
      allergens: ["Peanuts"],
    },
  ];

  // State for cookie products
  const [cookieProducts] = useState<CookieProduct[]>(mockedCookieProducts);

  // State for cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add to cart function
  const handleAddToCart = (product: CookieProduct, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { product, quantity }]);
    }

    //alert(`${quantity} ${product.name}(s) added to cart!`); alert for database debugging
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    // Find the item
    const existingItemIndex = cartItems.findIndex(
      (item) => item.product.id === productId
    );

    if (existingItemIndex >= 0) {
      // If quantity is set to 0, confirm deletion
      if (newQuantity === 0) {
        const confirmed = window.confirm(
          "Are you sure you want to remove this item from your cart?"
        );

        if (confirmed) {
          // Remove the item from cart
          const updatedCart = cartItems.filter(
            (item) => item.product.id !== productId
          );
          setCartItems(updatedCart);
        }
      } else {
        // Update quantity
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity = newQuantity;
        setCartItems(updatedCart);
      }
    }
  };

  return (
    <>
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Cookies</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart section - takes 1/3 of the width on large screens */}
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
              <div
                className={`grid gap-8 ${
                  cartItems.length > 0
                    ? "grid-cols-1 md:grid-cols-2" // 2 columns when cart is visible
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // 3 columns when cart is hidden
                }`}
              >
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
