"use client";

import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MenuIcon, Home, Ship, Camera, Users, Phone, Calendar } from "lucide-react";

export const NavbarMobile = () => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <MenuIcon className="w-5 h-5" />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-col p-2 bg-white/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl min-w-[250px]">
              
              {/* Main Navigation */}
              <NavigationMenuLink
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-300 font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </NavigationMenuLink>

              <NavigationMenuLink
                href="/booking"
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-300 font-medium"
              >
                <Calendar className="w-4 h-4" />
                <span>Booking</span>
              </NavigationMenuLink>

              <NavigationMenuLink
                href="/experiences"
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-300 font-medium"
              >
                <Users className="w-4 h-4" />
                <span>Experiences</span>
              </NavigationMenuLink>

              <NavigationMenuLink
                href="/gallery"
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-300 font-medium"
              >
                <Camera className="w-4 h-4" />
                <span>Gallery</span>
              </NavigationMenuLink>

              <NavigationMenuLink
                href="/about"
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-300 font-medium"
              >
                <Users className="w-4 h-4" />
                <span>About</span>
              </NavigationMenuLink>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-2" />

              {/* Contact */}
              <NavigationMenuLink
                href="tel:+447936524299"
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-300 font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>+44 7936 524299</span>
              </NavigationMenuLink>

              {/* API Test (smaller) */}
              <NavigationMenuLink
                href="/api-test"
                className="flex items-center gap-3 px-4 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                <span>API Test</span>
              </NavigationMenuLink>

              {/* User Links - Hidden for now */}
              <div className="hidden">
                <NavbarUserLinks />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
