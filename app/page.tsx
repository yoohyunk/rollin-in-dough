"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  // Featured products
  const featuredProducts = [
    { id: 1, name: "Chocolate Chip", price: 2.99, image: "/chocolate-chip.png" },
    { id: 2, name: "Sugar Cookie", price: 3.49, image: "/sugar-cookie.png" },
    { id: 3, name: "Nutella Croissant", price: 4.99, image: "/nutella-croissant.png" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#fc3296]/30"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Rollin' in Dough
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            "A balanced diet is a 🍪 in each hand"
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/shop" className="bg-white text-[#fc3296] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#fbdb8a] transition-colors duration-300">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Image 
                src="/baker-mom.jpg" 
                alt="Baker mom" 
                width={500} 
                height={500} 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-6 text-[#fc3296]">About Us</h2>
              <p className="text-lg mb-6 leading-relaxed">
                Meet the flour-powered mom behind Rollin' in Dough Vernon. From her cozy kitchen, she crafts mouthwatering 
                cookies and cupcakes that are as delightful as her candid, behind-the-scenes Instagram stories.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                Balancing motherhood with a side hustle, she infuses each creation with passion and a sprinkle of real-life charm. 
                Her treats aren't just baked goods—they're edible joy, perfect for any occasion.
              </p>
              <Link href="/about" className="inline-block border-2 border-[#fc3296] text-[#fc3296] px-6 py-2 rounded-md hover:bg-[#fc3296] hover:text-white transition-colors duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#fbf6e9]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#fc3296]">Our Popular Treats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-white hover:bg-[#fbdb8a] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    style={{objectFit: "cover"}}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-[#fc3296]">{product.name}</h3>
                  <p className="text-gray-600 mb-4">${product.price}</p>
                  <button className="w-full bg-[#fc3296] text-white py-2 rounded-md hover:bg-[#e88b22]  transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/shop" className="inline-block bg-[#fc3296] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#fbdb8a] hover:text-[#fc3296] transition-colors duration-300">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#fc3296]">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#fbf6e9] p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="mb-4 italic">"These cookies are the highlight of my week! Absolutely divine and worth every calorie!"</p>
              <p className="font-semibold">- Sarah Johnson</p>
            </div>
            <div className="bg-[#fbf6e9] p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="mb-4 italic">"I ordered cookies for my daughter's birthday and they were a huge hit! Will definitely order again."</p>
              <p className="font-semibold">- Michael Rodriguez</p>
            </div>
            <div className="bg-[#fbf6e9] p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="mb-4 italic">"The Nutella croissants are absolutely to die for! I can't get enough of these treats!"</p>
              <p className="font-semibold">- Emily Thompson</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#fc3296]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to satisfy your sweet tooth?</h2>
          <p className="text-xl mb-8 text-white max-w-2xl mx-auto">
            Order now and experience our freshly baked cookies delivered right to your doorstep!
          </p>
          <Link href="/shop" className="inline-block bg-white text-[#fc3296] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#fbdb8a] transition-colors duration-300">
            Order Now
          </Link>
        </div>
      </section>
    </>
  );
}