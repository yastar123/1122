import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Gift, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    // Validate passwords match
    if (resetData.newPassword !== resetData.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (resetData.newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetData.email,
          newPassword: resetData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setResetData({ email: "", newPassword: "", confirmPassword: "" });
      } else {
        setError(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setError("Gagal menghubungi server");
    } finally {
      setIsLoading(false);
    }
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
              Reset Password
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Masukkan email dan password baru Anda
            </p>
          </div>
        </div>
      </div>

      {/* Reset Form */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleReset} className="space-y-4 sm:space-y-6">
              {message && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={resetData.email}
                  onChange={(e) => setResetData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Masukkan email Anda"
                  className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Password Baru
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={resetData.newPassword}
                  onChange={(e) => setResetData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Masukkan password baru"
                  className="h-12 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Konfirmasi Password Baru
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={resetData.confirmPassword}
                  onChange={(e) => setResetData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Konfirmasi password baru"
                  className="h-12 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Mereset Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong className="text-blue-900">Info:</strong><br />
                Gunakan email yang terdaftar di sistem untuk mereset password Anda.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/login")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Login
          </Button>
        </div>
      </div>
    </div>
  );
}