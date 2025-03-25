"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Cookie {
  id: number;
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
  // Convert to state so we can update it
  const [cartItems, setCartItems] = useState<Cookie[]>([
    {
      id: 1,
      name: "Chocolate Chip",
      price: 2.5,
      quantity: 2,
      image: "/chocolate-chip.png",
    },
    {
      id: 2,
      name: "Sugar Cookie",
      price: 3.0,
      quantity: 1,
      image: "/sugar-cookie.png",
    },
    {
      id: 3,
      name: "Nutella Loaded Coissant",
      price: 1.5,
      quantity: 3,
      image: "/nutella-croissant.png",
    },
  ]);

  // Past orders data
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([
    {
      id: "ORD-2023-001",
      date: "2023-03-10",
      total: 15.5,
      status: "Delivered",
      items: [
        {
          id: 1,
          name: "Chocolate Chip",
          price: 2.5,
          quantity: 4,
          image: "/chocolate-chip.png",
        },
        {
          id: 3,
          name: "Nutella Loaded Coissant",
          price: 1.5,
          quantity: 4,
          image: "/nutella-croissant.png",
        },
      ],
    },
    {
      id: "ORD-2023-002",
      date: "2023-03-15",
      total: 9.0,
      status: "Shipped",
      items: [
        {
          id: 2,
          name: "Sugar Cookie",
          price: 3.0,
          quantity: 3,
          image: "/sugar-cookie.png",
        },
      ],
    },
  ]);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Function to handle quantity updates
  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      // Confirm before removing item
      const confirmed = window.confirm(
        "Are you sure you want to remove this item from your cart?"
      );

      if (confirmed) {
        // Remove the item
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      }
    } else {
      // Update quantity
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <>
      <main className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>

          {/* Current Cart Section */}
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-10">
            {cartItems.length > 0 ? (
              <>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 rounded-lg shadow-sm border border-gray-100 hover:bg-[#fbdb8a] hover:border-[#fc3296] transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">{item.name}</h2>
                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="text-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Total:</h2>
                    <p className="text-xl font-bold">${calculateTotal()}</p>
                  </div>

                  <button
                    className="mt-6 w-full bg-[#fc3296] text-white py-3 px-6 rounded-md hover:bg-[#fbdb8a] hover:text-[#fc3296] transition-colors duration-300 font-medium"
                    onClick={() => (window.location.href = "/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  className="bg-[#fc3296] text-white py-2 px-6 rounded-md hover:bg-[#fbdb8a] hover:text-[#fc3296] transition-colors duration-300"
                  onClick={() => (window.location.href = "/shop")}
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
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div
                      className="p-4 flex justify-between items-center cursor-pointer border-l-4 border-[#fc3296]"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${order.total.toFixed(2)}
                        </p>
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
                          {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between">
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
    </>
  );
};

export default CartPage;
