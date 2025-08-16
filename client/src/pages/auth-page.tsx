import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Gift } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({
    username: "admin@gmail.com",
    password: "admin123",
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/admin");
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      username: loginData.username,
      password: loginData.password,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-primary rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Masuk untuk mengakses dashboard admin
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Email/Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Masukkan email atau username"
                  className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Masukkan password"
                  className="h-12 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Masuk...
                  </div>
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>
            
            {/* Reset Password Link */}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setLocation("/reset-password")}
                className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
              >
                Lupa Password? Reset Password
              </Button>
            </div>
            
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
