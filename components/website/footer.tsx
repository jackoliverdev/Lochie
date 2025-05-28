'use client';

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Mail, Instagram, Facebook, MessageCircle, Waves, Anchor, Star } from "lucide-react";
import { FC } from "react";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-t from-blue-900/100 via-cyan-900/100 to-blue-800/100 text-white overflow-hidden backdrop-blur-md">
      {/* Floating Background Elements */}
      <div className="absolute top-6 left-10 opacity-10">
        <Waves className="w-16 h-16 text-cyan-400 animate-pulse" />
      </div>
      <div className="absolute bottom-6 right-20 opacity-10">
        <Anchor className="w-12 h-12 text-blue-400 animate-float" />
      </div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="hover:opacity-80 transition-all duration-300 group inline-block">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/gili/jasperlogo.png"
                    alt="Jasper Luxury Boat Tours"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    Jasper{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Luxury
                    </span>
                  </span>
                  <span className="text-xs text-cyan-200 font-light tracking-wide">
                    Boat Tours
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Experience the magic of Gili Islands with our premium luxury boat tours and unforgettable adventures.
            </p>
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-gray-300 ml-2">5.0 • 200+ Reviews</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/booking", label: "Booking" },
                { href: "/experiences", label: "Experiences" },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-cyan-300 transition-colors duration-300 text-sm hover:translate-x-1 transform"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300">Contact</h3>
            <div className="space-y-3">
              <Link 
                href="tel:+447936524299"
                className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition-all duration-300 group text-sm"
              >
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+44 7936 524299</span>
              </Link>
              
              <Link 
                href="mailto:info@jasperluxury.com"
                className="flex items-center gap-3 text-gray-300 hover:text-cyan-300 transition-all duration-300 group text-sm"
              >
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@jasperluxury.com</span>
              </Link>
              
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Gili Islands, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Social & Book */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-300">Follow Us</h3>
            <div className="flex gap-3">
              <Link
                href="https://instagram.com/jasperluxury"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-300 hover:scale-110 group"
              >
                <Instagram className="w-5 h-5 group-hover:text-white" />
              </Link>
              <Link
                href="https://facebook.com/jasperluxury"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 group"
              >
                <Facebook className="w-5 h-5 group-hover:text-white" />
              </Link>
              <Link
                href="https://wa.me/447936524299"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-300 hover:scale-110 group"
              >
                <svg className="w-5 h-5 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </Link>
            </div>
            
            <Link
              href="#book"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              Book Your Adventure
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            © {currentYear} Jasper Luxury Boat Tours. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-cyan-300 transition-colors">
              Terms of Service
            </Link>
            <div className="text-gray-500">
              Made with ❤️ in Indonesia
            </div>
          </div>
        </div>
      </div>

      {/* Background Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent backdrop-blur-sm -z-10" />
    </footer>
  );
}; 