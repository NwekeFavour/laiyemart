import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.message) {
      return toast.error("Please fill in all required fields.");
    }

    setLoading(true);
    try {
      // Ensure this URL matches your backend route
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/contact-us`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( formData ),
        });
      
        const result = await response.json();
      if (response.ok && result.success) {
        toast.success("Message sent! Check your email.");
        setFormData({ name: '', email: '', subject: '', message: '' }); 
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid! grid-cols-1! md:grid-cols-2! gap-4!">
        {/* Name Field */}
        <div className="grid! gap-2!">
          <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="border-input flex h-9 w-full rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base  outline-none focus-visible:border-slate-300 focus-visible:shadow-md"
          />
        </div>

        {/* Email Field */}
        <div className="grid! gap-2!">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="border-input flex h-9 w-full rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base  outline-none focus-visible:border-slate-300 focus-visible:shadow-md"
          />
        </div>
      </div>

      {/* Subject Field */}
      <div className="grid! gap-2!">
        <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          className="border-input flex h-9 w-full rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base  outline-none focus-visible:border-slate-300 focus-visible:shadow-md"
        />
      </div>

      {/* Message Field */}
      <div className="grid! gap-2!">
        <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us more about your project or question..."
          className="border-input flex h-24 w-full md:h-30 rounded-md border border-slate-100 bg-transparent px-3 py-1 text-base  outline-none focus-visible:border-slate-300 focus-visible:shadow-md"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex bg-[#4F46E5]/90 text-white items-center rounded-[100px]! justify-center gap-2 text-sm font-medium  hover:bg-[#4F46E5] h-10 w-full px-6 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;