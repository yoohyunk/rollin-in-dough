"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { useCart } from "@/app/Context/NewCartContext";

const CartPage: React.FC = () => {
  const { cart, updateCart, clearCart } = useCart();
  const router = useRouter();

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({
        items: cart.map((item) => ({
          id: item.product.id,
          variationId: item.product.variationId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.imageUrl,
        })),
        email: user.email,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert("Error creating order: " + data.message);
      return;
    }
    const reDirectUrl = data.order.url;
    if (reDirectUrl) {
      await clearCart();
      router.push(reDirectUrl);
    }

    alert("Order placed successfully!");
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

        {/* Cart Section */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
          {cart.length > 0 ? (
            <>
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex justify-between items-center p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-[#fbdb8a] hover:border-[#fc3296] transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.product.imageUrl || "/placeholder.png"}
                          alt={item.product.name || "Product image"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {item.product.name}
                        </h2>
                        <div className="flex items-center mt-2 space-x-2">
                          <button
                            onClick={() => updateCart(0, item)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() => updateCart(item.quantity - 1, item)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateCart(item.quantity + 1, item)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Total:</h2>
                  <p className="text-xl font-bold">${calculateTotal()}</p>
                </div>
                <button
                  className="mt-6 w-full bg-[#fc3296] text-white py-3 px-6 rounded-md hover:bg-[#fbdb8a] hover:text-[#fc3296]"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                className="bg-[#fc3296] text-white py-2 px-6 rounded-md hover:bg-[#fbdb8a] hover:text-[#fc3296]"
                onClick={() => router.push("/shop")}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CartPage;
