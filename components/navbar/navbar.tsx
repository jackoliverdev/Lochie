import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { Phone, MapPin, Waves, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

export const NavBar: FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-in fade-in">
      {/* Background with premium black gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl border-b border-gray-700/30" />
      
      {/* Main Navigation Container */}
      <nav className="relative">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between py-4">
            {/* Logo Section */}
            <Link href="/" className="group flex items-center gap-4 hover:opacity-90 transition-all duration-300">
              <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/gili/jasperlogo.png"
                  alt="Jasper Luxury Boat Tours"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors duration-300">
                  Jasper{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Luxury
                  </span>
                </span>
                <span className="text-sm text-cyan-200 font-light tracking-wide">
                  Premium Boat Tours
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                {[
                  { href: "/", label: "Home" },
                  { href: "/booking", label: "Booking" },
                  { href: "/experiences", label: "Experiences" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/about", label: "About" }
                ].map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="px-4 py-2.5 text-white hover:text-cyan-300 font-medium transition-all duration-300 hover:bg-white/10 rounded-xl backdrop-blur-sm border border-transparent hover:border-cyan-400/30"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Contact & Actions */}
              <div className="flex items-center gap-4">
                {/* Location Badge */}
                <div className="hidden xl:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-full">
                  <MapPin className="w-4 h-4 text-cyan-300" />
                  <span className="text-cyan-200 text-sm font-medium">Gili Islands</span>
                </div>

                {/* Phone Button */}
                <Link 
                  href="tel:+447936524299"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                  <span>+44 7936 524299</span>
                </Link>

                {/* Premium Book Now Button */}
                <Link
                  href="/booking"
                  className="group bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Book Now</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Floating Wave Decoration */}
            <div className="absolute top-6 right-20 opacity-20">
              <Waves className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden py-4">
            <div className="flex items-center justify-between">
              
              {/* Mobile Logo */}
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="relative w-9 h-9 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src="/gili/jasperlogo.png"
                    alt="Jasper Luxury Boat Tours"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    Jasper{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Luxury
                    </span>
                  </span>
                  <span className="text-xs text-cyan-200 font-light tracking-wide -mt-0.5">
                    Boat Tours
                  </span>
                </div>
              </Link>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2">
                {/* Quick Call Button */}
                <Link 
                  href="tel:+447936524299"
                  className="flex items-center justify-center w-10 h-9 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Call us"
                >
                  <Phone className="w-4 h-4" />
                </Link>

                {/* Premium Mobile Book Button */}
                <Link
                  href="/booking"
                  className="group bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="leading-none">Book</span>
                  </div>
                </Link>

                {/* Mobile Menu Toggle */}
                <NavbarMobile />
              </div>
            </div>
          </div>
        </div>

        {/* Hidden User Links */}
        <div className="hidden">
          <NavbarUserLinks />
        </div>
      </nav>
    </div>
  );
};
