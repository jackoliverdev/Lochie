'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Camera, MapPin, Star, Users, Waves, Anchor } from 'lucide-react';

export const GalleryHero = () => {
  return (
    <section className="relative min-h-[100svh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-28 sm:pt-24 lg:pt-0 pb-8 lg:pb-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/gili/gilit2.jpg"
          alt="Gili Islands Paradise"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient Overlays for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10" />
      </div>

      {/* Floating Background Elements - Hidden on mobile for cleaner look */}
      <div className="absolute top-20 left-10 opacity-20 z-10 hidden lg:block">
        <Waves className="w-24 h-24 text-cyan-400 animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 z-10 hidden lg:block">
        <Anchor className="w-20 h-20 text-blue-400 animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 lg:px-6 text-center text-white py-4 lg:py-0">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 lg:px-6 py-2 lg:py-3 text-cyan-300 text-sm font-medium mb-6 mt-4 lg:mt-0"
        >
          <Camera className="w-4 h-4" />
          <span>Photo Gallery</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 lg:space-y-6 mb-6 lg:mb-8"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight">
            Capture the{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Magic
            </span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-cyan-200 max-w-3xl mx-auto leading-relaxed px-4 lg:px-0">
            Discover breathtaking moments from our luxury boat adventures in the pristine waters of Gili Islands
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 mb-8 lg:mb-12"
        >
          {[
            {
              icon: Camera,
              number: "500+",
              label: "Epic Photos",
              gradient: "from-cyan-500 to-blue-600"
            },
            {
              icon: Users,
              number: "1000+",
              label: "Happy Guests",
              gradient: "from-blue-500 to-purple-600"
            },
            {
              icon: MapPin,
              number: "15+",
              label: "Stunning Locations",
              gradient: "from-purple-500 to-pink-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className={`w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mb-3 lg:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2">{stat.number}</div>
              <div className="text-cyan-200 text-xs lg:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Location & Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 text-gray-300"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 lg:w-5 h-4 lg:h-5 text-cyan-400" />
            <span className="text-sm lg:text-base">Gili Islands, Indonesia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 lg:w-4 h-3 lg:h-4 fill-current text-yellow-400" />
              ))}
            </div>
            <span className="text-sm lg:text-base">5.0 • 200+ Reviews</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Only show on larger screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:block"
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}; 