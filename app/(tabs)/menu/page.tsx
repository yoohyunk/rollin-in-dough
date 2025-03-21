"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import CookieCard, { CookieProduct } from './cookies';
import Header from '../../header';
import Footer from '../../footer';

interface CartItem {
  product: CookieProduct;
  quantity: number;
}

export default function MenuPage() {
  // State for cookie products
  const [cookieProducts, setCookieProducts] = useState<CookieProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cookies from Firebase
  useEffect(() => {
    async function fetchCookieProducts() {
      try {
        setLoading(true);
        const cookiesCollection = collection(db, 'cookieProducts');
        const cookieSnapshot = await getDocs(cookiesCollection);
        
        const productList = cookieSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            price: data.price,
            description: data.description,
            imageUrl: data.imageUrl,
            ingredients: data.ingredients || [],
            allergens: data.allergens || [],
          } as CookieProduct;
        });
        
        setCookieProducts(productList);
        setError(null);
      } catch (err) {
        console.error('Error fetching cookie products:', err);
        setError('Failed to load cookie products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCookieProducts();
  }, []);
  
  // Add to cart function
  const handleAddToCart = (product: CookieProduct, quantity: number) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      // Add new item
      setCartItems([...cartItems, { product, quantity }]);
    }
    
    // Show feedback
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#ffccff] py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#000080] text-center mb-8">Our Cookie Menu</h1>
          
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent"></div>
              <p className="mt-2 text-[#000080]">Loading our delicious cookies...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {!loading && !error && cookieProducts.length === 0 && (
            <p className="text-center text-[#000080] py-10">No cookies available at the moment. Please check back later!</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cookieProducts.map(product => (
              <CookieCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
          
          {cartItems.length > 0 && (
            <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#000080] mb-4">Shopping Cart</h2>
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <li key={index} className="py-3 flex justify-between items-center">
                    <span>{item.quantity} x {item.product.name}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t pt-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">
                  ${cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              <button 
                className="mt-4 w-full bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors duration-300"
                onClick={() => alert('Proceed to checkout!')}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}