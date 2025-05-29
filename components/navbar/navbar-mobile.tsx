"use client";

import { useState, useEffect } from "react";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { 
  MenuIcon, 
  Home, 
  Ship, 
  Camera, 
  Users, 
  Phone, 
  Calendar, 
  X,
  MapPin,
  Star,
  Waves,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export const NavbarMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { href: "/", label: "Home", icon: Home, description: "Welcome to paradise" },
    { href: "/booking", label: "Booking", icon: Calendar, description: "Reserve your adventure" },
    { href: "/experiences", label: "Experiences", icon: Ship, description: "Luxury boat tours" },
    { href: "/gallery", label: "Gallery", icon: Camera, description: "Stunning memories" },
    { href: "/about", label: "About", icon: Users, description: "Our story" },
  ];

  return (
    <>
      {/* Compact Menu Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center p-1 text-white hover:text-cyan-300 transition-colors"
        aria-label="Open navigation menu"
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {/* Backdrop & Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200 
              }}
              className="fixed top-0 right-0 bottom-0 z-[101] w-80 max-w-[85vw] bg-gradient-to-b from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl border-l border-gray-700/30 shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-white">
                    Jasper{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Luxury
                    </span>
                  </h2>
                  <p className="text-sm text-cyan-200">Boat Tours Menu</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1 + 0.2,
                        duration: 0.4
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-[1.02] touch-manipulation border border-transparent hover:border-cyan-400/30"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                          <item.icon className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-base group-hover:text-cyan-300 transition-colors duration-300">
                            {item.label}
                          </div>
                          <div className="text-cyan-200/80 text-xs">
                            {item.description}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cyan-400/60 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Section */}
                <div className="px-6 pb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-xl p-3 border border-cyan-400/20"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">Quick Contact</div>
                        <div className="text-cyan-200 text-xs">Call us directly</div>
                      </div>
                    </div>
                    <Link
                      href="tel:+447936524299"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 touch-manipulation shadow-lg text-sm"
                    >
                      +44 7936 524299
                    </Link>
                  </motion.div>
                </div>

                {/* Location Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="px-6 pb-4"
                >
                  <div className="flex items-center justify-center gap-2 text-cyan-200 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>Gili Trawangan, Indonesia</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current text-yellow-400" />
                    ))}
                    <span className="text-cyan-200 text-xs ml-2">5.0 • 200+ Reviews</span>
                  </div>
                </motion.div>
              </div>

              {/* Floating Decoration */}
              <div className="absolute top-20 left-6 opacity-10">
                <Waves className="w-16 h-16 text-cyan-400 animate-pulse" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
