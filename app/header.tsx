"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import AuthModal from "@/components/AuthModal";
import { userSignOut } from "@/firebase/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/firebaseConfig";

export default function Header() {
  const headerHeight = "90px"; // Define the height of the header
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const check = async () => {
      auth.onAuthStateChanged((user) => {
        console.log("User is signed in:", user);
        setIsAuth(!!user);
      });
    };
    check();
  }, []);

  const handleSignOut = async () => {
    await userSignOut();
    setIsAuth(false); // 🔑 update state to reflect logout
  };

  return (
    <>
      {/* Header */}
      <Link href="/" className="block">
        <div
          className="fixed top-0 left-0 w-full bg-white py-4 px-4 md:px-8 z-50"
          style={{ height: headerHeight }}
        >
          {/* Main header container */}
          <div className="flex justify-between items-center h-16 relative">
            {/* Hamburger menu button - only visible on mobile */}
            <button
              className="md:hidden flex flex-col justify-center items-center p-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from propagating to the Link
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              <span
                className={`block w-6 h-0.5 bg-[#fc3296] transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#fc3296] my-1 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#fc3296] transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              ></span>
            </button>

            {/* Desktop navigation - hidden on mobile */}
            <nav className="hidden md:flex flex-1">
              <ul className="flex space-x-2 lg:space-x-6 ml-1">
                <li>
                  <Link
                    href="/shop"
                    className="nav-link px-3 lg:px-6 py-2 lg:py-3 text-base lg:text-lg border-2 border-[#fc3296] text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="nav-link px-3 lg:px-6 py-2 lg:py-3 text-base lg:text-lg border-2 border-[#fc3296] text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram"
                    className="nav-link px-3 lg:px-6 py-2 lg:py-3 text-base lg:text-lg border-2 border-[#fc3296] text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="nav-link px-3 lg:px-6 py-2 lg:py-3 text-base lg:text-lg border-2 border-[#fc3296] text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Centered logo and title */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <Image
                src="/rollin-in-dough.jpg"
                alt="Rollin in Dough Logo"
                width={60}
                height={60}
                className="mr-2 md:mr-4 md:w-[80px] md:h-[80px]"
              />
              <Link
                href="/"
                className="text-2xl md:text-4xl text-[#fc3296] font-bold font-sans"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
              >
                Rollin in Dough
              </Link>
            </div>

            {/* Right-aligned login button */}
            <div className="flex-1 flex justify-end">
              {isAuth ? (
                <Button onClick={handleSignOut}>log out</Button>
              ) : (
                <AuthModal />
              )}
            </div>
          </div>

          {/* Mobile menu - only visible when open on mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute left-0 w-full bg-white shadow-lg z-40 py-4 px-6 mt-2">
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link
                    href="/shop"
                    className="block px-4 py-2 text-lg text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="block px-4 py-2 text-lg text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                  </Link>
                </li>
                <li>
                  <Link
                    href="/instagram"
                    className="block px-4 py-2 text-lg text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-lg text-[#fc3296] hover:bg-[#fc3296] hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </Link>

      {/* Main content area */}
      <div style={{ paddingTop: headerHeight }}>
        {/* Your page content goes here */}
      </div>
    </>
  );
}
