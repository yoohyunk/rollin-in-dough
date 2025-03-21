"use client";
import Header from "./header";
import "./globals.css";
import Footer from "./footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffccff] text-[#000080] font-sans py-8">
        {/* Main content goes here */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-6">Welcome to Rollin in Dough!</h2>
          <p className="mb-4">Indulge in our delicious homemade cookies, baked fresh daily.</p>
          {/* Add more content here */}
        </div>
      </div>
    <Footer/>
    </>
  );
}