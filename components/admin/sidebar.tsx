'use client';

import { useState } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  CreditCard, 
  Users, 
  Settings, 
  Menu,
  X,
  Waves,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Bookings', href: '/app/bookings', icon: Calendar },
  { name: 'Activities', href: '/app/activities', icon: Waves },
  { name: 'Customers', href: '/app/customers', icon: Users },
  { name: 'Payments', href: '/app/payments', icon: CreditCard },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function AdminSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    router.push('/login');
  };

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Indonesian Boats</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Waves className="w-5 h-5 text-blue-600" />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 h-auto"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : ''}
            >
              <item.icon className={cn(
                "flex-shrink-0 transition-colors",
                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600",
                collapsed ? "w-5 h-5" : "w-4 h-4"
              )} />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sign Out" : ''}
        >
          <LogOut className={cn(
            "flex-shrink-0",
            collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
          )} />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-50 lg:hidden bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Indonesian Boats</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Footer */}
        <div className="border-t border-gray-200 p-4">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
} 