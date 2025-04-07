"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Order } from "@/types/customerData";

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
        setOrder(data.order);
      } catch (err) {
        console.error(err);
        setError("Internal error fetching order details");
      }
    };

    fetchOrder();
  }, [id]);

  const subtotal = order?.lineItems.reduce(
    (acc, item) => acc + item.quantity * Number(item.basePriceMoney.amount),
    0
  );

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
    <div className="max-w-2xl mx-auto p-8  bg-white rounded-lg shadow-md overflow-hidden my-10">
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
      <p className="mb-2">
        <strong>Status:</strong> {order.orderStatus}
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-3">Items</h2>
      <ul className="list-disc ml-6">
        {order.lineItems !== null &&
          order.lineItems.map((item, index) => {
            // Look up the corresponding item data by catalogObjectId

            return (
              <li
                key={index}
                className="mb-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div>
                    <p>
                      {item.quantity} x {item.name}
                    </p>
                  </div>
                </div>
                <div>
                  $
                  {(item.quantity * Number(item.basePriceMoney.amount)).toFixed(
                    2
                  )}
                </div>
              </li>
            );
          })}
      </ul>
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-semibold mt-6 mb-3">Subtotal</h2>
        <p className="text-xl font-bold">${subtotal}</p>
      </div>
      <h2 className="text-2xl font-semibold mt-6 mb-3">Service Charges</h2>
      <ul className="list-disc ml-6">
        {order.serviceCharges.map((charge, index) => (
          <li key={index} className="flex justify-between items-center ">
            <div>{charge.name}:</div>
            <div>${charge.totalMoney.amount} </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-semibold mt-6 mb-3">Total Tax</h2>
        <p className="text-xl font-bold">${order.totalTax.amount}</p>
      </div>
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-semibold mt-6 mb-3">Total Price</h2>
        <p className="text-xl font-bold">${order.totalPrice.amount}</p>
      </div>
    </div>
  );
}
