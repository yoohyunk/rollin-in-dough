"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CookieCard, { CookieProduct } from "@/components/cookies";
import { useEffect, useState } from "react";
import { useCart } from "./Context/NewCartContext";

export default function Home() {
  const { addCookieToCart } = useCart();
  const [cookieProducts, setCookieProducts] = useState<CookieProduct[]>([]);
  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const res = await fetch(`/api/get-catalog`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        data.sort(
          (a: CookieProduct, b: CookieProduct) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const items = [data[0], data[1], data[2]];
        setCookieProducts(items);
      } catch (error) {
        console.error("Error fetching catalog items:", error);
      }
    };

    fetchCatalogItems();
  }, []);
  // Featured products

  return (
    <>
      <div className="min-h-screen w-full">
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
              Rollin&apos; in Dough
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              &quot;A balanced diet is a 🍪 in each hand&quot;
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href="/shop"
                className="bg-white text-[#fc3296] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#fbdb8a] transition-colors duration-300"
              >
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
                  src="/aboutMe.png"
                  alt="Baker Family"
                  width={800} // Adjust width here
                  height={600} // Adjust height here
                  className="rounded-lg shadow-xl object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-4xl font-bold mb-6 text-[#fc3296]">
                  About Us
                </h2>
                <p className="text-lg mb-6 leading-relaxed">
                  Meet the flour-powered mom behind Rollin&apos; in Dough
                  Vernon. From her cozy kitchen, she crafts mouthwatering
                  cookies and cupcakes that are as delightful as her candid,
                  behind-the-scenes Instagram stories.
                </p>
                <p className="text-lg mb-6 leading-relaxed">
                  Balancing motherhood with a side hustle, she infuses each
                  creation with passion and a sprinkle of real-life charm. Her
                  treats aren&apos;t just baked goods—they&apos;re edible joy,
                  perfect for any occasion.
                </p>
                <Link
                  href="/about"
                  className="inline-block border-2 border-[#fc3296] text-[#fc3296] px-6 py-2 rounded-md hover:bg-[#fc3296] hover:text-white transition-colors duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-[#fbf6e9]">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#fc3296]">
              Our Popular Treats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cookieProducts.map((product) => (
                <CookieCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addCookieToCart(product)}
                />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-block bg-[#fc3296] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#fbdb8a] hover:text-[#fc3296] transition-colors duration-300"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#fc3296]">
              What Our Customers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#fbf6e9] p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic">
                  &quot;These cookies are the highlight of my week! Absolutely
                  divine and worth every calorie!&quot;
                </p>
                <p className="font-semibold">- Taylor Swift</p>
              </div>
              <div className="bg-[#fbf6e9] p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic">
                  &quot;I ordered cookies for my daughter&apos;s birthday and
                  they were a huge hit! I think she almost looked at me.&quot;
                </p>
                <p className="font-semibold">- The POTUS</p>
              </div>
              <div className="bg-[#fbf6e9] p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
                <p className="mb-4 italic">
                  &quot;The Nutella croissants are absolutely to kill for! I
                  can&apos;t get enough of these treats! Don&apos:t tell
                  T&apos;Challa&quot;
                </p>
                <p className="font-semibold">- Michael B Jordan (killmonger)</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#fc3296]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to satisfy your sweet tooth?
            </h2>
            <p className="text-xl mb-8 text-white max-w-2xl mx-auto">
              Order now and experience our freshly baked cookies delivered right
              to your doorstep!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-[#fc3296] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#fbdb8a] transition-colors duration-300"
            >
              Order Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
