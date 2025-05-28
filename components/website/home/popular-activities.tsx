'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Calendar, Star, ArrowRight, Waves, Music, Camera, Anchor, Clock, Users, Heart } from 'lucide-react';

const PopularActivities = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const mainActivities = [
    {
      id: 1,
      title: "Marine Adventures",
      subtitle: "Snorkeling with Turtles & Manta Rays",
      description: "Swim with turtles, statues, manta rays, sharks and tropical fish + whatever else you may come across!",
      image: "/gili/activities/snorkel.jpg",
      gradient: "from-cyan-500 to-blue-600",
      icon: "🐢",
      price: "Included",
      duration: "Full Day",
      rating: "4.9"
    },
    {
      id: 2,
      title: "Adrenaline Rush",
      subtitle: "Jet Ski Adventures",
      description: "Feel the thrill on crystal clear waters with our premium jet ski experiences (add-on available).",
      image: "/gili/activities/jetski.jpg",
      gradient: "from-orange-500 to-red-600",
      icon: "🏎️",
      price: "Add-on",
      duration: "30 mins",
      rating: "4.8"
    },
    {
      id: 3,
      title: "Peaceful Exploration",
      subtitle: "Kayaking & Paddle Boarding",
      description: "Explore hidden lagoons and pristine waters at your own pace with our kayaks and paddle boards.",
      image: "/gili/activities/kayak.jpeg",
      gradient: "from-green-500 to-emerald-600",
      icon: "🛶",
      price: "Included",
      duration: "Unlimited",
      rating: "4.7"
    },
    {
      id: 4,
      title: "Water Sports Mastery",
      subtitle: "Wakeboarding Excellence",
      description: "Master the waves with professional wakeboarding equipment and expert guidance.",
      image: "/gili/activities/waking.jpg",
      gradient: "from-purple-500 to-pink-600",
      icon: "🏄‍♂️",
      price: "Included",
      duration: "Sessions",
      rating: "4.8"
    },
    {
      id: 5,
      title: "Premium Sound System",
      subtitle: "Music & Entertainment",
      description: "Bring your own music and create the perfect party atmosphere with our premium sound system.",
      image: "/gili/boat-features.jpg",
      gradient: "from-indigo-500 to-purple-600",
      icon: "🎵",
      price: "Included",
      duration: "All Day",
      rating: "4.9"
    },
    {
      id: 6,
      title: "Sunset Cruises",
      subtitle: "Golden Hour Magic",
      description: "Witness magical golden hours with breathtaking views and romantic atmosphere.",
      image: "/gili/sunset.jpg",
      gradient: "from-yellow-500 to-orange-600",
      icon: "🌅",
      price: "Included",
      duration: "2 Hours",
      rating: "5.0"
    }
  ];

  // Create multiple sets for infinite scroll
  const infiniteActivities = [...mainActivities, ...mainActivities, ...mainActivities];

  const additionalActivities = [
    { icon: "🧺", title: "Luxury Picnics", desc: "Gourmet dining experience" },
    { icon: "🏝️", title: "Island Hopping", desc: "Explore multiple islands" },
    { icon: "🦄", title: "Huge Inflatable Unicorn", desc: "Fun for all ages" },
    { icon: "🍹", title: "Onboard Mini Bar", desc: "Premium beverages" },
    { icon: "🎉", title: "Private Parties", desc: "Celebrate in paradise" },
    { icon: "🍌", title: "Banana Boat Rides", desc: "Perfect for big groups" }
  ];

  interface ActivityCardProps {
    activity: typeof mainActivities[0];
    index: number;
  }

  const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index }) => {
    return (
      <div className="flex-shrink-0 w-80 mx-4">
        <Link
          href="/experiences"
          className="block group cursor-pointer transition-all duration-500 hover:scale-105"
        >
          <div className="relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
            
            {/* Background Image */}
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${activity.gradient}/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
              
              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.3,
                    }}
                  >
                    {activity.icon}
                  </motion.div>
                  <div className="flex flex-col gap-1">
                    <span className={`px-3 py-1 ${activity.price === 'Included' ? 'bg-green-500/80' : 'bg-orange-500/80'} backdrop-blur-sm rounded-full text-xs font-medium`}>
                      {activity.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span className="text-xs">{activity.rating}</span>
                    </div>
                  </div>
                </div>
                <Heart className="w-5 h-5 fill-current text-red-400 group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Bottom Section */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold leading-tight mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-cyan-200 text-sm font-light">
                    {activity.subtitle}
                  </p>
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 mt-2">
                    {activity.description}
                  </p>
                </div>

                {/* Info Bar */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="text-xs">View Details</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Subtle glow effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${activity.gradient}/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm`} />
          </div>
        </Link>
      </div>
    );
  };

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-b from-white via-cyan-50/30 to-white relative overflow-hidden"
    >
      
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 opacity-10">
        <Waves className="w-32 h-32 text-cyan-500 animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10">
        <Anchor className="w-24 h-24 text-blue-500 animate-float" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full px-6 py-2 text-cyan-600 text-sm font-medium">
            <Star className="w-4 h-4 fill-current" />
            <span>Our Signature Experiences</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Popular{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Adventures
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From heart-pumping adventures to peaceful exploration, every moment on our luxury boat 
              is designed to create unforgettable memories in paradise.
            </p>
          </div>
        </motion.div>

        {/* Sliding Activities Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative h-96 flex items-center overflow-hidden mb-16"
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-cyan-50/30 via-cyan-50/20 to-transparent z-10 pointer-events-none" />
          
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-cyan-50/30 via-cyan-50/20 to-transparent z-10 pointer-events-none" />
          
          {/* Moving carousel */}
          <motion.div
            className="flex items-center"
            animate={{
              x: [0, -2016], // Width calculation: 6 cards × (320px + 32px margin) = 2016px
            }}
            transition={{
              duration: 35, // Slower for smooth luxury feel
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {infiniteActivities.map((activity, index) => (
              <ActivityCard
                key={`${activity.id}-${Math.floor(index / mainActivities.length)}-${index}`}
                activity={activity}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Additional Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Plus Much More!
            </h3>
            <p className="text-lg text-gray-600">
              Every charter includes these amazing extras at no additional cost
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {additionalActivities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                className="w-full"
              >
                <Link
                  href="/experiences"
                  className="group p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-cyan-200 transition-all duration-300 hover:scale-105 text-center block h-[140px] w-full flex flex-col items-center justify-center"
                >
                  <motion.div 
                    className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h4 className="font-semibold text-cyan-800 mb-1 text-sm leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-cyan-600 text-xs leading-tight">
                    {item.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16 space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-cyan-500/25 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Adventure
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/experiences">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  View All Experiences
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularActivities; 