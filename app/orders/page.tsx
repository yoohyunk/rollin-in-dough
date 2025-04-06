"use client";
import React, { useEffect, useState } from "react";

interface Cookie {
  name: string;
  quantity: number;
}

interface PastOrder {
  id: string;
  createdAt: string;
  lineItems: Cookie[];
}

export default function OrdersPage() {
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/get-orders", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        // Assume the API returns either an array or an object with an 'orders' field.
        const data = await response.json();
        // For example, if your response is { orders: [...] }
        setPastOrders(data.orders || data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-80">
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
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  {/* <p className="font-semibold">${order.total.toFixed(2)}</p> */}
                  {/* <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span> */}
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="font-medium mb-2">Order Items:</p>
                  <ul className="space-y-2">
                    {order.lineItems.map((item) => (
                      <li key={item.name} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        {/* <span>${(item.price * item.quantity).toFixed(2)}</span> */}
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
          <p className="text-gray-500">You don&apos;t have any past orders</p>
        </div>
      )}
    </div>
  );
}
