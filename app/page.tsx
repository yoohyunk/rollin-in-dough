"use client";
import Link from "next/link";
import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth");
      }
    });
    return unsubscribe;
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#ffccff] text-[#000080] font-sans">
      <h1
        className="text-5xl mb-8"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
      >
        Rollin in Dough
      </h1>

      <ul className="list-none p-0">
        <li className="my-4">
          <Link
            href="/about"
            className="text-2xl text-[#000080] bg-[#ffb3ff] py-2 px-4 border-2 border-[#000080] rounded transition-all duration-300 ease-in-out"
          >
            View Menu
          </Link>
        </li>
        <li className="my-4">
          <Link
            href="/api"
            className="text-2xl text-[#000080] bg-[#ffb3ff] py-2 px-4 border-2 border-[#000080] rounded transition-all duration-300 ease-in-out"
          >
            View Cart
          </Link>
        </li>
        <li className="my-4">
          <Link
            href="/cart"
            className="text-2xl text-[#000080] bg-[#ffb3ff] py-2 px-4 border-2 border-[#000080] rounded transition-all duration-300 ease-in-out"
          >
            Checkout
          </Link>
        </li>
      </ul>
    </div>
  );
}
