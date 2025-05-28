import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { Phone, MapPin, Waves } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

export const NavBar: FC = () => {
  return (
    <>
      <div className="animate-in fade-in w-full absolute top-0 left-0 right-0 z-50">
        <nav className="container px-6 md:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link href="/" className="hover:opacity-80 transition-all duration-300 group">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/gili/jasperlogo.png"
                    alt="Jasper Luxury Boat Tours"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    Jasper{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Luxury
                    </span>
                  </span>
                  <span className="text-sm text-cyan-200 font-light tracking-wide">
                    Boat Tours
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Link 
                  href="/" 
                  className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  Home
                </Link>
                <Link 
                  href="/booking" 
                  className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  Booking
                </Link>
                <Link 
                  href="/experiences" 
                  className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  Experiences
                </Link>
                <Link 
                  href="/gallery" 
                  className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  Gallery
                </Link>
                <Link 
                  href="/about" 
                  className="px-4 py-2 text-white hover:text-cyan-300 font-medium transition-colors duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  About
                </Link>
                <Link 
                  href="/api-test" 
                  className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors duration-300 hover:bg-white/5 rounded-lg backdrop-blur-sm text-xs"
                >
                  API Test
                </Link>
              </div>

              {/* Contact Info & CTA */}
              <div className="flex items-center gap-4">
                {/* Location Badge */}
                <div className="hidden xl:flex items-center gap-1 text-cyan-200 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Gili Islands</span>
                </div>

                {/* Phone Button */}
                <Link 
                  href="tel:+447936524299"
                  className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                  <span>+44 7936 524299</span>
                </Link>

                {/* Book Now CTA */}
                <Link
                  href="#book"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30"
                >
                  Book Now
                </Link>

                {/* User Links */}
                <div className="hidden">
                  <NavbarUserLinks />
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile Phone */}
              <Link 
                href="tel:+447936524299"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-full text-xs font-medium hover:bg-white/20 transition-all duration-300"
              >
                <Phone className="w-3 h-3" />
              </Link>

              {/* Mobile Book Now */}
              <Link
                href="#book"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-full font-semibold text-xs shadow-lg transition-all duration-300 hover:scale-105"
              >
                Book
              </Link>

              <NavbarMobile />
            </div>
          </div>

          {/* Floating Wave Decoration */}
          <div className="absolute top-4 right-20 opacity-20 hidden xl:block">
            <Waves className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </nav>

        {/* Navbar Background Blur Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/100 via-cyan-900/100 to-blue-800/100 backdrop-blur-md border-b border-cyan-400/30 -z-10" />
      </div>
    </>
  );
};
