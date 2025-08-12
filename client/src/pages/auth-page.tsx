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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-green-light rounded-full flex items-center justify-center">
              <Gift className="text-brand-green text-2xl" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Email/Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="admin123"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-dark"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Masuk..." : "Masuk"}
              </Button>
            </form>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Login Default:</strong><br />
                Email: admin@gmail.com<br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Hero */}
      <div className="flex-1 bg-gradient-to-br from-brand-green to-brand-green-dark flex items-center justify-center p-8">
        <div className="text-center text-white">
          <Gift className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Sistem Undian Kupon</h2>
          <p className="text-lg opacity-90 mb-8">
            Kelola hadiah, peserta, dan pantau semua aktivitas undian dengan mudah
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p className="text-sm opacity-80">
              Masuk dengan kredensial admin untuk mengakses dashboard manajemen undian
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}