import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Gift } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({
    username: "admin@gmail.com",
    password: "admin123",
  });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-green-light rounded-full flex items-center justify-center">
              <Gift className="text-brand-green text-2xl" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-username">Email/Username</Label>
                    <Input
                      id="login-username"
                      type="text"
                      value={loginData.username}
                      onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-username">Username</Label>
                    <Input
                      id="register-username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-brand-green hover:bg-brand-green-dark"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Mendaftar..." : "Daftar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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
          <ul className="text-left space-y-2 max-w-md">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              Kelola pengaturan profil dan konten
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              Tambah dan edit hadiah undian
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              Tentukan pemenang berdasarkan kupon
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              Pantau riwayat pengajuan pengguna
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
