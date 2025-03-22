"use client";
import "./globals.css";


export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-[#000080] font-sans py-8">
        {/* Main content goes here */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl mb-6">Welcome to Rollin’ in Dough Cookie Co.</h2>
          <p className="mb-4"> “A balanced diet is a 🍪 in each hand”</p>
          {/* Add more content here */}
          <h2 className="text-3xl mb-6"> About Us </h2>
        </div>
      </div>

    </>
  );
}