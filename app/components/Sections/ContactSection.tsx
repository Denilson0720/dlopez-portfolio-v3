"use client";

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function ContactSection() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowWelcome(true);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleAutoComplete = () => {
    setMessage("Hello Denilson,\n\nI'd like to get in touch with you regarding ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const publicKey = "JTS2DsfV8D3mHylVd";
    const serviceId = "service_2l65nuq";
    const templateId = "template_c61fszo";

    try {
      if (!formRef.current) {
        throw new Error("Form reference not found");
      }

      if (!publicKey || !serviceId || !templateId) {
        throw new Error("EmailJS configuration is missing. Please check your environment variables.");
      }

      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey: publicKey,
      });

      setSubmitStatus("success");
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setSubmitStatus("error");
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section="contact"
      className="min-h-screen py-20 px-8 scroll-mt-20"
    >
      <h2 className="text-5xl font-bold mb-12 text-black dark:text-white">Contact</h2>
      <div className="max-w-4xl">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-900 border border-accent-blue/30 rounded-lg">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              👋 Welcome! I'd love to hear from you. Feel free to send me a message using the form below, 
              or reach out through any of my social links. I'm always open to discussing new projects, 
              collaborations, or just having a chat!
            </p>
          </div>
        )}

        {/* Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="user_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="user_email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-colors"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-colors"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message
              </label>
              <button
                type="button"
                onClick={handleAutoComplete}
                className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                ✨ Auto Complete Message
              </button>
            </div>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-colors resize-none"
              placeholder="Type your message here..."
            />
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
              <p className="text-green-700 dark:text-green-300">
                ✅ Message sent successfully! I'll get back to you soon.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300">
                ❌ Failed to send message. Please try again or contact me directly via email.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 bg-accent-blue text-white rounded-lg transition-colors font-medium ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-accent-blue/90"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Or connect with me on:</p>
          <div className="flex gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

