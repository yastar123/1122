import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, Gift, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function HomePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    couponNumber: "",
    fullName: "",
    whatsappNumber: "",
  });
  const [result, setResult] = useState<{
    isWinner: boolean;
    prizeName?: string;
    message: string;
  } | null>(null);

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const checkCouponMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/check-coupon", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: data.isWinner ? "Selamat!" : "Hasil Cek Kupon",
        description: data.message,
        variant: data.isWinner ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Kesalahan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.couponNumber || !formData.fullName || !formData.whatsappNumber) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    checkCouponMutation.mutate(formData);
  };

  const handleWhatsAppContact = () => {
    if (settings?.adminWhatsApp) {
      window.open(`https://wa.me/${settings.adminWhatsApp}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Logo Section */}
      <div className="max-w-md mx-auto pt-8 pb-4 text-center">
        <div className="w-24 h-24 mx-auto mb-4 border-2 border-pink-400 rounded-full flex items-center justify-center">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <span className="text-pink-500 font-bold text-lg">Logo</span>
          )}
        </div>
      </div>

      {/* Banner Section */}
      <div className="max-w-md mx-auto px-6 mb-6">
        <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
          {settings?.bannerUrl ? (
            <img src={settings.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <span className="text-pink-500 font-bold text-lg">Banner</span>
          )}
        </div>
      </div>

      {/* Main Coupon Check Form */}
      <div className="max-w-md mx-auto px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder={settings?.couponPlaceholder || "Tulis Nomor kuponmu disini"} 
              className="h-12 text-gray-500 border-gray-300"
              value={formData.couponNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, couponNumber: e.target.value }))}
              required
              data-testid="input-coupon-number"
            />
            <span className="text-red-500 text-sm">*</span>
          </div>

          <div>
            <Input
              type="text"
              placeholder={settings?.namePlaceholder || "Nama Lengkap"}
              className="h-12 text-gray-500 border-gray-300"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
              data-testid="input-full-name"
            />
            <span className="text-red-500 text-sm">*</span>
          </div>

          <div>
            <Input
              type="tel"
              placeholder={settings?.whatsappPlaceholder || "Nomor Whatsapp"}
              className="h-12 text-gray-500 border-gray-300"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              required
              data-testid="input-whatsapp-number"
            />
            <span className="text-red-500 text-sm">*</span>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-lg"
            disabled={checkCouponMutation.isPending}
            data-testid="button-check-coupon"
          >
            {checkCouponMutation.isPending ? "Mengecek..." : "CEK"}
          </Button>
        </form>

        {/* Result Display */}
        {result && (
          <div className="mt-6 p-4 text-center">
            <p className={`text-lg font-medium ${
              result.isWinner ? "text-green-600" : "text-gray-600"
            }`}>
              {result.message}
            </p>
            {result.isWinner && result.prizeName && (
              <p className="text-sm font-medium text-green-600 mt-2">
                Hadiah: {result.prizeName}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Prize Banner Section */}
      <div className="max-w-md mx-auto px-6 mt-8">
        <div className="text-center mb-4">
          <span className="text-pink-500 font-bold text-lg">Banner</span>
        </div>
        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          {settings?.bannerUrl ? (
            <img src={settings.bannerUrl} alt="Prize Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <Gift className="mx-auto text-gray-400 w-16 h-16 mb-2" />
              <p className="text-gray-500">Gambar hadiah akan ditampilkan di sini</p>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      {settings?.termsAndConditions && (
        <div className="max-w-md mx-auto px-6 mt-6">
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {settings.termsAndConditions}
          </div>
        </div>
      )}

      {/* Contact Admin Button */}
      {settings?.adminWhatsApp && (
        <div className="max-w-md mx-auto px-6 mt-8 pb-8">
          <Button
            onClick={handleWhatsAppContact}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center justify-center"
            data-testid="button-contact-admin"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c5.518 0 9.998 4.48 9.998 9.998 0 1.78-.47 3.45-1.293 4.89L22 22l-5.112-1.283c-1.44.823-3.11 1.293-4.89 1.293C6.48 22.01 2 17.53 2 12.012 2 6.494 6.48 2.014 12.012 2zm-1.268 7.874c-.26 0-.468.208-.468.468v3.124c0 .26.208.468.468.468h2.536c.26 0 .468-.208.468-.468V10.342c0-.26-.208-.468-.468-.468h-2.536z"/>
            </svg>
            Hubungi Admin
          </Button>
        </div>
      )}

      {/* Admin Access Button */}
      <Link href="/auth">
        <Button
          size="icon"
          className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-900 shadow-lg"
          title="Admin Access"
          data-testid="button-admin-access"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
