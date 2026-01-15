import React, { useState } from "react";

// 1. Define Content Mapping for Newsletter
const NEWSLETTER_CONTENT = {
  "Fashion": {
    heading: "Join the Style Club",
    subtext: "Get weekly style inspiration and 10% off your first outfit.",
    button: "Get My Discount",
  },
  "Electronics": {
    heading: "Level Up Your Tech",
    subtext: "Be the first to know about product drops and exclusive tech deals.",
    button: "Stay Updated",
  },
  "Beauty & Health": {
    heading: "Unlock Your Glow",
    subtext: "Join our community for self-care tips and early access to new launches.",
    button: "Join Now",
  },
  "Home & Garden": {
    heading: "Build Your Sanctuary",
    subtext: "Get interior design tips and seasonal gardening offers delivered to you.",
    button: "Inspire Me",
  },
  "Food & Groceries": {
    heading: "Fresh Deals Daily",
    subtext: "Subscribe for weekly recipes and exclusive discounts on fresh produce.",
    button: "Start Saving",
  },
  "Digital Products": {
    heading: "Boost Your Workflow",
    subtext: "Get free assets every month and news on the latest digital tools.",
    button: "Get Free Assets",
  },
  "General Store": {
    heading: "Stay in the Loop",
    subtext: "Sign up for our newsletter and get 10% off your first order!",
    button: "Subscribe",
  }
};

const NewsletterSignup = ({ storeType }) => {
  const [email, setEmail] = useState("");

  // 2. Select the content based on storeType
  const content = NEWSLETTER_CONTENT[storeType] || NEWSLETTER_CONTENT["General Store"];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="bg-neutral-50 py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {/* Dynamic Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tighter">
          {content.heading}
        </h2>
        
        {/* Dynamic Subtext */}
        <p className="mt-4 text-gray-600 text-lg">
          {content.subtext}
        </p>

        <form
          onSubmit={handleSubscribe}
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3"
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-80 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent text-gray-900 transition-all"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white font-bold rounded-md hover:bg-neutral-700 transition-colors shadow-lg"
          >
            {content.button}
          </button>
        </form>

        <p className="mt-4 text-gray-400 text-sm">
          No spam, just quality updates. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;