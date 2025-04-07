"use client";
import React, { useEffect } from "react";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  useEffect(() => {
    // Initialize EmailJS once when component mounts
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
    if (publicKey) {
      emailjs.init(publicKey);
    } else {
      console.error("EmailJS public key is missing");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Store a reference to the form element before async operations
    const form = e.currentTarget;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

    // Validate env variables exist
    if (!serviceId || !templateId || !publicKey) {
      console.error("Missing EmailJS configuration:", {
        serviceId: !!serviceId,
        templateId: !!templateId,
        publicKey: !!publicKey,
      });
      alert("Email configuration error. Please contact the administrator.");
      return;
    }

    try {
      await emailjs.sendForm(
        serviceId,
        templateId,
        form, // Use the stored reference instead of e.currentTarget
        publicKey
      );

      alert("Message sent successfully!");
      form.reset(); // Use the stored reference
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        alert(
          `Failed to send message. ${error.message || "Please try again later."}`
        );
      } else {
        console.error("Error details:", "Unknown error");
        alert("Failed to send message. Please try again later.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24 mb-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>

        <p className="text-center mb-8">
          We&apos;d love to hear from you! Please fill out the form below or
          reach out to us directly.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc3296] focus:border-[#fc3296]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc3296] focus:border-[#fc3296]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block font-medium">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows={5}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc3296] focus:border-[#fc3296]"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#fc3296] text-white font-medium rounded-lg shadow-md hover:bg-[#e02882] transition-colors duration-300 transform hover:-translate-y-1"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
