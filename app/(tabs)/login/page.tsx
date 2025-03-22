"use client";
import React from "react";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbf6e5]/50 px-4">
      <h1 className="text-4xl font-bold text-[#fc3296] mb-4">
        🍪 Rollin&apos; in Dough 🍪
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Welcome back! Please log in to continue.
      </p>
      <form className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fc3296]"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fc3296]"
        />
        <button
          type="submit"
          className="w-full bg-[#fc3296] text-white py-2 rounded-md font-semibold hover:bg-[#e88b22] transition-colors duration-300"
        >
          Log In
        </button>
      </form>
      <p className="mt-4 text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#fc3296] hover:underline">
          Sign up here!
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
