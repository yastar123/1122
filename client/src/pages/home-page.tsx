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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Logo Section */}
      <div className="max-w-md mx-auto pt-8 pb-6 text-center px-4">
        <div className="relative">
          {settings?.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt="Logo" 
              className="w-28 h-28 mx-auto mb-6 object-contain rounded-2xl shadow-xl bg-white p-2 border-4 border-white/50 backdrop-blur-sm"
            />
          ) : (
            <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <SettingsIcon className="w-12 h-12 text-white" />
            </div>
          )}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Gift className="w-4 h-4 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Cek Kupon Undian
        </h1>
        <p className="text-gray-600 text-base font-medium">
          {settings?.siteName || "Sistem Undian Kupon"}
        </p>
      </div>

      {/* Banner Section */}
      {settings?.bannerUrl && (
        <div className="max-w-md mx-auto px-4 mb-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src={settings.bannerUrl} 
              alt="Banner" 
              className="w-full h-52 object-cover transform hover:scale-105 transition-transform duration-300"
              data-testid="img-banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      )}

      {/* Main Coupon Check Form */}
      <div className="max-w-md mx-auto px-4">
        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <Input
                  type="text"
                  placeholder={settings?.couponPlaceholder || "Tulis Nomor kuponmu disini"} 
                  className="h-14 text-gray-700 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 transition-all duration-200 text-center font-medium"
                  value={formData.couponNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, couponNumber: e.target.value }))}
                  required
                  data-testid="input-coupon-number"
                />
                <span className="text-red-500 text-xs">* Wajib diisi</span>
              </div>

              <div className="space-y-1">
                <Input
                  type="text"
                  placeholder={settings?.namePlaceholder || "Nama Lengkap"}
                  className="h-14 text-gray-700 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 transition-all duration-200 text-center font-medium"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  data-testid="input-full-name"
                />
                <span className="text-red-500 text-xs">* Wajib diisi</span>
              </div>

              <div className="space-y-1">
                <Input
                  type="tel"
                  placeholder={settings?.whatsappPlaceholder || "Nomor Whatsapp"}
                  className="h-14 text-gray-700 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 transition-all duration-200 text-center font-medium"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  required
                  data-testid="input-whatsapp-number"
                />
                <span className="text-red-500 text-xs">* Wajib diisi</span>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled={checkCouponMutation.isPending}
                data-testid="button-check-coupon"
              >
                {checkCouponMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Mengecek...
                  </div>
                ) : (
                  "🎁 CEK KUPON 🎁"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <div className="mt-8">
            <Card className={`border-0 shadow-2xl rounded-3xl overflow-hidden ${
              result.isWinner 
                ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200" 
                : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
            }`}>
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  result.isWinner ? "bg-green-500" : "bg-gray-500"
                }`}>
                  {result.isWinner ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <Info className="w-8 h-8 text-white" />
                  )}
                </div>
                <p className={`text-xl font-bold mb-2 ${
                  result.isWinner ? "text-green-700" : "text-gray-700"
                }`}>
                  {result.message}
                </p>
                {result.isWinner && result.prizeName && (
                  <>
                    <div className="bg-white/70 rounded-2xl p-4 mt-4">
                      <p className="text-lg font-bold text-green-800 mb-2">
                        🎁 Hadiah: {result.prizeName}
                      </p>
                      {result.prizeBanner && (
                        <div className="mt-4 overflow-hidden rounded-xl shadow-lg">
                          <img 
                            src={result.prizeBanner} 
                            alt={`Hadiah ${result.prizeName}`}
                            className="w-full h-48 object-cover"
                            data-testid="img-prize-banner"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>



      {/* Terms and Conditions */}
      {settings?.termsAndConditions && (
        <div className="max-w-md mx-auto px-4 mt-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Syarat & Ketentuan</h3>
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {settings.termsAndConditions}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* WhatsApp Admin Contact Button */}
      {settings?.adminWhatsApp && (
        <div className="max-w-md mx-auto px-4 mt-6 text-center">
          <button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="button-contact-admin-main"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            💬 Hubungi Admin WhatsApp
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="max-w-md mx-auto px-4 mt-8 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/alamat-toko">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer">
              <CardContent className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <span className="text-blue-700 font-bold text-sm">Alamat Toko</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/katalog-produk">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-purple-50 to-purple-100 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <span className="text-purple-700 font-bold text-sm">Katalog Produk</span>
              </CardContent>
            </Card>
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
