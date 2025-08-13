import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, Gift, CheckCircle, Info, MapPin, Package } from "lucide-react";
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
    prizeBanner?: string;
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
              <>
                <p className="text-sm font-medium text-green-600 mt-2">
                  Hadiah: {result.prizeName}
                </p>
                {result.prizeBanner && (
                  <div className="mt-4 p-2 border-2 border-green-400 rounded-lg bg-green-50">
                    <img 
                      src={result.prizeBanner} 
                      alt={`Hadiah ${result.prizeName}`}
                      className="w-full h-40 object-cover rounded-lg"
                      data-testid="img-prize-banner"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>



      {/* Terms and Conditions */}
      {settings?.termsAndConditions && (
        <div className="max-w-md mx-auto px-6 mt-6">
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {settings.termsAndConditions}
          </div>
        </div>
      )}

      {/* WhatsApp Admin Contact Button */}
      {settings?.adminWhatsApp && (
        <div className="max-w-md mx-auto px-6 mt-4">
          <button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-full shadow-md transition-colors duration-200"
            data-testid="button-contact-admin-main"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Hubungi Admin
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="max-w-md mx-auto px-6 mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/alamat-toko">
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center border-blue-200 hover:bg-blue-50"
            >
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-blue-600 font-semibold">Alamat Toko</span>
            </Button>
          </Link>
          <Link href="/katalog-produk">
            <Button
              variant="outline"
              className="w-full h-12 flex items-center justify-center border-purple-200 hover:bg-purple-50"
            >
              <Package className="w-5 h-5 mr-2 text-purple-600" />
              <span className="text-purple-600 font-semibold">Katalog Produk</span>
            </Button>
          </Link>
        </div>
      </div>



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
