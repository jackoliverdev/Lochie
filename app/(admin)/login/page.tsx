import { AuthCard } from "@/components/auth-card";
import { ProviderLoginButtons } from "@/components/auth/provider-login-buttons";
import { OrSeparator } from "@/components/ui/or-separator";
import { Shield, Waves } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center justify-center p-4">
      <section className="w-full max-w-md space-y-6">
        
        {/* Admin Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="relative">
              <Shield className="w-8 h-8 text-blue-600" />
              <Waves className="w-4 h-4 text-cyan-500 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Indonesian Boats Management Portal
          </p>
        </div>

        {/* Auth Components */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
          <AuthCard />
          <OrSeparator />
          <ProviderLoginButtons />
        </div>
        
        {/* Security Notice */}
        <div className="text-center text-sm text-gray-500">
          <p>🔒 Secure admin access only</p>
          <p>Authorised personnel only</p>
        </div>
      </section>
    </div>
  );
} 