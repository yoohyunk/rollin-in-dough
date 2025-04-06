"use client";

import React, { useEffect, useState } from "react";

interface Order {
  orderId: string;
  createdAt: string;
  lineItems: { quantity: number; name: string }[];
}

import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/get-order?orderId=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          setError("Error fetching order details");
          return;
        }
        const data = await response.json();
        console.log("Order details:", data);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
        setError("Internal error fetching order details");
      }
    };

    fetchOrder();
  }, [id]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <p className="mb-2">
        <strong>Order ID:</strong> {order.orderId}
      </p>
      <p className="mb-2">
        <strong>Created At:</strong>{" "}
        {new Date(order.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-3">Items</h2>
      <ul className="list-disc ml-6">
        {order.lineItems.map((item, index) => (
          <li key={index}>
            {item.quantity} x {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
