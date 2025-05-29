'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Calendar, Star, Waves, Anchor } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  
  const images = [
    '/gili/gilit2.jpg',
    '/gili/gilit1.webp'
  ];

  // Check if mobile and disable motion if needed
  useEffect(() => {
    const checkMobile = () => {
      const mobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // Disable complex animations on mobile for better performance
      if (mobile) {
        setMotionEnabled(false);
      }
    };
    
    checkMobile();
  }, []);

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, []);

  const features = [
    "Snorkeling with turtles & manta rays",
    "Paddle boards & kayaking", 
    "Jet ski & wakeboarding",
    "Sunrise & sunset cruises",
    "Island hopping adventures",
    "Onboard mini bar & sound system"
  ];

  const experienceCards = [
    {
      icon: "🐢",
      title: "Marine Adventures",
      description: "Swim with turtles, manta rays & tropical fish",
      bgColor: "bg-cyan-500/20"
    },
    {
      icon: "🍹", 
      title: "Luxury Amenities",
      description: "Mini bar, sound system & premium comfort",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: "🏄‍♂️",
      title: "Water Sports", 
      description: "Jet ski, wakeboarding & paddle boarding",
      bgColor: "bg-purple-500/20"
    }
  ];

  // Safe motion component wrapper
  const SafeMotion = ({ children, className, ...motionProps }: any) => {
    if (!motionEnabled || isMobile) {
      return <div className={className}>{children}</div>;
    }
    
    try {
      return <motion.div className={className} {...motionProps}>{children}</motion.div>;
    } catch (error) {
      console.warn('Motion animation failed, falling back to static:', error);
      return <div className={className}>{children}</div>;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Transition */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Gili Islands paradise ${index + 1}`}
              fill
              className="object-cover object-center"
              priority={index === 0}
              quality={95}
            />
          </div>
        ))}
        
        {/* Gradient Overlays for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-10" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 z-20 hidden lg:block">
        <div className="animate-float">
          <Waves className="w-16 h-16 text-cyan-400/60" />
        </div>
      </div>
      <div className="absolute bottom-32 right-32 z-20 hidden lg:block">
        <div className="animate-float-delayed">
          <Anchor className="w-12 h-12 text-blue-400/50" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Main Content */}
          <div className="text-white space-y-8">
            
            {/* Badge */}
            <SafeMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 text-cyan-200 text-sm font-medium"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Luxury Boat Experience</span>
            </SafeMotion>

            {/* Main Heading */}
            <SafeMotion
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block text-white">
                  Jasper{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Luxury
                  </span>
                </span>
                <span className="block text-white">Boat Tours</span>
              </h1>
              
              <div className="space-y-2">
                <p className="text-xl lg:text-2xl text-cyan-100 font-light">
                  Luxury Boat Charters in Gili Islands & Lombok
                </p>
                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                  Experience unforgettable tours with stunning views and activities in paradise. 
                  From snorkeling with turtles to sunset cruises, create memories that last a lifetime.
                </p>
              </div>
            </SafeMotion>

            {/* Features Grid */}
            <SafeMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              {features.map((feature, index) => (
                <SafeMotion 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                  className="flex items-center gap-2 text-sm text-gray-200 group hover:text-cyan-300 transition-colors"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full group-hover:bg-cyan-300 transition-colors" />
                  <span>{feature}</span>
                </SafeMotion>
              ))}
            </SafeMotion>

            {/* CTA Buttons */}
            <SafeMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Adventure
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                +44 7936 524299
              </Button>
            </SafeMotion>

            {/* Location Badge */}
            <SafeMotion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center gap-2 text-gray-300"
            >
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">Gili Trawangan, Lombok, Indonesia</span>
            </SafeMotion>
          </div>

          {/* Right Column - Experience Cards */}
          <SafeMotion
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 lg:pl-8"
          >
            
            {/* Floating Experience Cards */}
            <div className="space-y-4">
              {experienceCards.map((card, index) => (
                <SafeMotion
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.2) }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <SafeMotion 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 + (index * 0.2) }}
                      className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}
                    >
                      <span className="text-2xl">{card.icon}</span>
                    </SafeMotion>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{card.title}</h3>
                      <p className="text-gray-300 text-sm">{card.description}</p>
                    </div>
                  </div>
                </SafeMotion>
              ))}
            </div>

            {/* Pricing Teaser */}
            <SafeMotion
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30"
            >
              <div className="text-center">
                <SafeMotion
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                  className="text-cyan-200 text-sm font-medium mb-2"
                >
                  Starting from
                </SafeMotion>
                <SafeMotion
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="text-white text-3xl font-bold"
                >
                  £50
                </SafeMotion>
                <SafeMotion
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.6 }}
                  className="text-gray-300 text-sm"
                >
                  per adult • Full day experience
                </SafeMotion>
              </div>
            </SafeMotion>

          </SafeMotion>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white">
          <path d="M0,120 C150,100 300,80 600,80 C900,80 1050,100 1200,120 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};

export default Hero; 