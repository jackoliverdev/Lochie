'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Calendar, Waves, Anchor, Phone, MapPin, ArrowDown } from 'lucide-react';

const BookingHero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    '/gili/gilit2.jpg',
    '/gili/activities/snorkel.jpg',
    '/gili/activities/jetski.jpg',
    '/gili/gilit1.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative min-h-[100svh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-28 sm:pt-24 lg:pt-0 pb-8 lg:pb-0">
      
      {/* Background Images with Transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-2000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Booking ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Gradient Overlays for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10" />
      
      {/* Floating Elements - Hidden on mobile for cleaner look */}
      <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
        <Waves className="w-24 h-24 text-cyan-400 animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 hidden lg:block">
        <Anchor className="w-32 h-32 text-blue-400 animate-float" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 text-center text-white py-4 lg:py-0">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 lg:px-6 py-2 lg:py-3 mb-6 lg:mb-8 mt-4 lg:mt-0"
        >
          <Calendar className="w-4 lg:w-5 h-4 lg:h-5 text-cyan-400" />
          <span className="text-white/90 font-medium text-sm lg:text-base">Simple • Secure • Instant</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 lg:space-y-6 mb-8 lg:mb-12"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight">
            Book Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-4 lg:px-0">
            Select your date, choose your experience, and secure your luxury boat tour 
            in the stunning Gili Islands. Real-time availability and instant confirmation.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-12"
        >
          {[
            { value: "10K+", label: "Happy Guests", color: "text-cyan-400" },
            { value: "4.9★", label: "Guest Rating", color: "text-blue-400" },
            { value: "8hrs", label: "Full Experience", color: "text-emerald-400" },
            { value: "£50", label: "Starting From", color: "text-purple-400" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl lg:rounded-2xl p-3 lg:p-6"
            >
              <div className={`text-xl lg:text-3xl font-bold ${stat.color} mb-1 lg:mb-2`}>{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-8 lg:mb-12"
        >
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg font-semibold shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 touch-manipulation"
            onClick={() => {
              const bookingSection = document.querySelector('#booking-calendar');
              bookingSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Start Booking
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto border-2 border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white hover:text-gray-900 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg font-semibold transition-all duration-300 hover:scale-105 touch-manipulation"
            asChild
          >
            <a href="tel:+447936524299">
              <Phone className="w-5 h-5 mr-2" />
              Call: +44 7936 524299
            </a>
          </Button>
        </motion.div>

        {/* Location Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 lg:px-6 py-2 lg:py-3 text-white/90"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-sm lg:text-base">Gili Trawangan, Lombok, Indonesia</span>
        </motion.div>
      </div>

      {/* Scroll Indicator - Only show on larger screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
      >
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Choose Your Date</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              const bookingSection = document.querySelector('#booking-calendar');
              bookingSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cursor-pointer"
          >
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default BookingHero; 