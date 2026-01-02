import React, { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Replace with real subscription logic
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Stay in the Loop
        </h2>
        <p className="mt-2 text-gray-600">
          Sign up for our newsletter and get <span className="font-semibold">10% off</span> your first order!
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubscribe}
          className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-auto flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 text-gray-900"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-neutral-900/60 text-white font-semibold rounded-md hover:bg-neutral-600 transition"
          >
            Subscribe
          </button>
        </form>

        {/* Small text */}
        <p className="mt-3 text-gray-400 text-sm">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;
