'use client';

import { ReactNode } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar, MobileSidebar } from "@/components/admin/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Mobile Menu & Title */}
            <div className="flex items-center gap-4">
              <MobileSidebar />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Indonesian Boats Admin
                </h1>
                <p className="text-sm text-gray-500">Manage your boat charter business</p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
