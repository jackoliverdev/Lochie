'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Anchor, MapPin, Star, Users, Waves, Shield } from 'lucide-react';

export const AboutHero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
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

      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 opacity-20 z-10">
        <Waves className="w-24 h-24 text-cyan-400 animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 z-10">
        <Anchor className="w-20 h-20 text-blue-400 animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-cyan-300 text-sm font-medium mb-6"
        >
          <Shield className="w-4 h-4" />
          <span>Our Story</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 mb-8"
        >
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Sailing Into{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Paradise
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-cyan-200 max-w-4xl mx-auto leading-relaxed">
            From humble beginnings to luxury boat tour pioneers, discover the passionate journey that made Jasper Luxury the premier choice for Gili Islands adventures
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              icon: Users,
              number: "10,000+",
              label: "Happy Guests",
              gradient: "from-cyan-500 to-blue-600"
            },
            {
              icon: Anchor,
              number: "8+",
              label: "Years Experience",
              gradient: "from-blue-500 to-purple-600"
            },
            {
              icon: Star,
              number: "5.0",
              label: "Average Rating",
              gradient: "from-purple-500 to-pink-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.number}</div>
              <div className="text-cyan-200 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Location & Rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Born in Gili Islands, Indonesia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
              ))}
            </div>
            <span>5.0 • 500+ Reviews</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm">Discover our journey</span>
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