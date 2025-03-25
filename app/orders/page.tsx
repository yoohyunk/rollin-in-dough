"use client";
import React, { useState } from "react";

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

export default function OrdersPage() {
  const [pastOrders] = useState<PastOrder[]>([
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
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
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
