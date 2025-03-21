'use client';
import React from 'react';
import Header from '@/app/header';
import Footer from '@/app/footer';

interface Cookie {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

const CartPage: React.FC = () => {
    // Example cart data
    const cartItems: Cookie[] = [
        { id: 1, name: 'Chocolate Chip', price: 2.5, quantity: 2, image: '/images/chocolate-chip.jpg' },
        { id: 2, name: 'Oatmeal Raisin', price: 3.0, quantity: 1, image: '/images/oatmeal-raisin.jpg' },
        { id: 3, name: 'Sugar Cookie', price: 1.5, quantity: 3, image: '/images/sugar-cookie.jpg' },
    ];

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#ffccff] py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-[#000080] text-center mb-8">Your Cart</h1>
                    
                    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-teal-600">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">Total:</h2>
                                <p className="text-xl font-bold text-teal-600">${calculateTotal()}</p>
                            </div>
                            
                            <button
                                className="mt-6 w-full bg-teal-500 text-white py-3 px-6 rounded-md hover:bg-teal-600 transition-colors duration-300 font-medium"
                                onClick={() => window.location.href = '/checkout'}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CartPage;