"use client";

import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Assuming you use Sonner for toasts

export default function SupportClient() {
  const [loading, setLoading] = useState(false);
  
  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We will contact you soon.");
      // Reset logic here if needed
    }, 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by going to 'My Orders' in your profile dashboard. Real-time updates are available for all shipments."
    },
    {
      question: "What is the return policy?",
      answer: "We offer a 7-day return policy for defective or incorrect products. Please ensure the product is unused and in original packaging."
    },
    {
      question: "How do I become a seller on Guptodhan?",
      answer: "Click on 'Become a Seller' in the footer or top menu. Fill out the registration form, submit necessary documents, and start selling!"
    },
    {
      question: "I haven't received my refund yet.",
      answer: "Refunds are processed within 5-7 working days after the return is approved. Check your bank statement or mobile wallet history."
    }
  ];

  return (
    <div className="pb-16">
      {/* --- Hero Section --- */}
      <div className="bg-[#00005E] text-white py-16 md:py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/pattern.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            How can we help you?
          </motion.h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Our support team is available 24/7 to assist with your queries, orders, and services.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* --- Info Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Call Us */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-[#00005E] w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-500 mb-4">Mon-Sat from 9am to 8pm</p>
            <a href="tel:+880123456789" className="text-blue-600 font-bold text-lg hover:underline">
              +880 1234 567 890
            </a>
          </motion.div>

          {/* Email Us */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-[#00005E] w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-500 mb-4">We reply within 24 hours</p>
            <a href="mailto:support@guptodhan.com" className="text-blue-600 font-bold text-lg hover:underline">
              support@guptodhan.com
            </a>
          </motion.div>

          {/* Live Chat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-[#00005E] w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-gray-500 mb-4">Chat with our support team</p>
            <button className="text-blue-600 font-bold text-lg hover:underline">
              Start Chatting
            </button>
          </motion.div>
        </div>

        {/* --- Main Content Grid (Form & FAQ) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-[#00005E] mb-6 flex items-center gap-2">
              <Send className="w-6 h-6" /> Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input placeholder="Yeamin Madbor" required className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input placeholder="+880 1xxx..." required className="bg-gray-50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input type="email" placeholder="you@example.com" required className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Order ID (Optional)</label>
                <Input placeholder="#ORD-12345" className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Textarea placeholder="Describe your issue..." rows={5} required className="bg-gray-50" />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#00005E] hover:bg-[#000045] h-12 text-lg font-medium"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Right: FAQ & Location */}
          <div className="space-y-8">
            
            {/* FAQ Section */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#00005E] mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6" /> Frequently Asked
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      {openFaq === idx ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 bg-white text-gray-600 text-sm border-t animate-in slide-in-from-top-2">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Office Location */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#00005E] mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" /> Our Head Office
              </h2>
              <p className="text-gray-600 mb-4">
                Visit us for direct support or business inquiries.
              </p>
              <div className="flex items-start gap-3 text-gray-700 mb-2">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <span>
                  Level 4, Guptodhan Tower,<br />
                  Banani, Dhaka - 1213, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Sunday - Thursday: 10:00 AM - 6:00 PM</span>
              </div>
              
              {/* Optional: Add an iframe map here if needed */}
              <div className="mt-4 h-40 w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                [Google Map Placeholder]
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}