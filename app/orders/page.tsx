"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PastOrder } from "@/types/customerData";

export default function OrdersPage() {
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/get-orders", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        setPastOrders(data.orders || data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

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
                onClick={() => router.push(`/order/${order.id}`)}
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
                  <p className="font-semibold">${order.totalPrice.amount}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
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
