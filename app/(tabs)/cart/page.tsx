'use client';
import React from 'react';
import Header from '@/app/header';
import Footer from '@/app/footer';

interface Cookie {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const CartPage: React.FC = () => {
    // Example cart data
    const cartItems: Cookie[] = [
        { id: 1, name: 'Chocolate Chip', price: 2.5, quantity: 2 },
        { id: 2, name: 'Oatmeal Raisin', price: 3.0, quantity: 1 },
        { id: 3, name: 'Sugar Cookie', price: 1.5, quantity: 3 },
    ];

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <>
        <Header/>
        <div className="cart-page">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item flex justify-between items-center border-b py-2">
                        <div className="item-details">
                            <h2 className="text-lg font-semibold">{item.name}</h2>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="item-price text-right">
                            <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-total mt-4 flex justify-between items-center border-t pt-4">
                <h2 className="text-xl font-bold">Total:</h2>
                <p className="text-xl font-bold">${calculateTotal()}</p>
            </div>
            <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Checkout
            </button>
        </div>
        <Footer/>
        </>
    );
};

export default CartPage;