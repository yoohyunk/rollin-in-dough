"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { useCart } from "@/app/Context/CartContext"; // Adjust the import path as needed

// Define types for your past orders and cookies (you can also reuse your CookieProduct type if available)
interface Cookie {
  id: string;
  variationId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PastOrder {
  id: string;
  date: string;
  total: number;
  status: "Delivered" | "Processing" | "Shipped";
  items: Cookie[];
}

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const router = useRouter();

  const calculateTotal = () => {
    return cartItems
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
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({
        items: cartItems.map((item) => ({
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
      // Clear the cart using the custom hook
      await clearCart();
      router.push(reDirectUrl);
    }

    // Optionally, create a past order record locally
    const order: PastOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      total: parseFloat(calculateTotal()),
      status: "Processing",
      items: cartItems.map((item) => ({
        id: item.product.id,
        variationId: item.product.variationId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.imageUrl,
      })),
    };

    setPastOrders((prev) => [...prev, order]);
    alert("Order placed successfully!");
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

        {/* Cart Section */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
          {cartItems.length > 0 ? (
            <>
              <div className="space-y-6">
                {cartItems.map((item, index) => (
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
                            onClick={() => updateQuantity(item.product.id, 0)}
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
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

        {/* Past Orders Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Past Orders</h2>

          {pastOrders.length > 0 ? (
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md">
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer border-l-4 border-[#fc3296]"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <p className="font-medium mb-2">Order Items:</p>
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li
                            key={`${item.id}-${index}`}
                            className="flex justify-between"
                          >
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">
                You don&apos;t have any past orders
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CartPage;
