"use client";
import Image from "next/image";

export default function AboutPage() {
  return (
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
            <h2 className="text-4xl font-bold mb-6 text-[#fc3296]">About Us</h2>
            <p className="text-lg mb-6 leading-relaxed">
              Meet the flour-powered mom behind Rollin&apos; in Dough Vernon.
              From her cozy kitchen, she crafts mouthwatering cookies and
              cupcakes that are as delightful as her candid, behind-the-scenes
              Instagram stories.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              Balancing motherhood with a side hustle, she infuses each creation
              with passion and a sprinkle of real-life charm. Her treats
              aren&apos;t just baked goods—they&apos;re edible joy, perfect for
              any occasion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
