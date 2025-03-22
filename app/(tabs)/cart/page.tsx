'use client';
import React, { useState } from 'react';
import Image from 'next/image';
 
interface Cookie {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

const CartPage: React.FC = () => {
    // Convert to state so we can update it
    const [cartItems, setCartItems] = useState<Cookie[]>([
        { id: 1, name: 'Chocolate Chip', price: 2.5, quantity: 2, image: '/chocolate-chip.png' },
        { id: 2, name: 'Sugar Cookie', price: 3.0, quantity: 1, image: '/sugar-cookie.png' },
        { id: 3, name: 'Nutella Loaded Coissant', price: 1.5, quantity: 3, image: '/nutella-croissant.png' },
    ]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Function to handle quantity updates
    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity === 0) {
            // Confirm before removing item
            const confirmed = window.confirm("Are you sure you want to remove this item from your cart?");
            
            if (confirmed) {
                // Remove the item
                setCartItems(cartItems.filter(item => item.id !== itemId));
            }
        } else {
            // Update quantity
            setCartItems(cartItems.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    return (
        <>
            <main className="min-h-screen py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>
                    
                    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
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
                                                    onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="text-gray-700">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
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
                                onClick={() => window.location.href = '/checkout'}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CartPage;