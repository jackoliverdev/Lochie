'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare, Phone, MapPin, Clock } from 'lucide-react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
    
    // You could integrate with your actual form handling here
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 opacity-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-3xl" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full px-6 py-2 text-cyan-600 text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Ready for Your{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Adventure?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our luxury boat tours? Want to customise your experience? Drop us a message and let's create your perfect Gili Islands adventure!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-gray-800 font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="Your name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-gray-800 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-gray-800 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-500" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="+44 7936 524299"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="text-gray-800 font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-500" />
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="Tell us about your dream boat tour experience..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            
            {/* Contact Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  title: "Call Us",
                  content: "+44 7936 524299",
                  subtext: "Available 24/7 for bookings",
                  gradient: "from-cyan-500 to-blue-600"
                },
                {
                  icon: Mail,
                  title: "Email Us",
                  content: "hello@jasperluxury.com",
                  subtext: "We'll respond within 24 hours",
                  gradient: "from-blue-500 to-purple-600"
                },
                {
                  icon: MapPin,
                  title: "Find Us",
                  content: "Gili Islands, Indonesia",
                  subtext: "Paradise awaits your arrival",
                  gradient: "from-purple-500 to-pink-600"
                },
                {
                  icon: Clock,
                  title: "Operating Hours",
                  content: "7:00 AM - 7:00 PM",
                  subtext: "Daily tours & adventures",
                  gradient: "from-pink-500 to-cyan-500"
                }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${contact.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
                      <p className="text-cyan-600 font-medium mb-1">{contact.content}</p>
                      <p className="text-sm text-gray-600">{contact.subtext}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}; 