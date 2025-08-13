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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            {settings?.logoUrl ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 overflow-hidden rounded-lg shadow-sm bg-gray-100 flex items-center justify-center">
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-primary rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 px-4">
              {settings?.siteTitle || "Cek Kupon Undian"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4">
              {settings?.siteSubtitle || "Sistem Undian Kupon"}
            </p>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      {settings?.bannerUrl && (
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="overflow-hidden rounded-lg shadow-sm">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
              <img 
                src={settings.bannerUrl} 
                alt="Banner" 
                className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                data-testid="img-banner"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Coupon Check Form */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="coupon-number" className="text-sm font-medium text-gray-700">
                  Nomor Kupon
                </Label>
                <Input
                  id="coupon-number"
                  type="text"
                  placeholder={settings?.couponPlaceholder || "Masukkan nomor kupon"} 
                  className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.couponNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, couponNumber: e.target.value }))}
                  required
                  data-testid="input-coupon-number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-sm font-medium text-gray-700">
                  Nama Lengkap
                </Label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder={settings?.namePlaceholder || "Masukkan nama lengkap"}
                  className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  data-testid="input-full-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-number" className="text-sm font-medium text-gray-700">
                  Nomor WhatsApp
                </Label>
                <Input
                  id="whatsapp-number"
                  type="tel"
                  placeholder={settings?.whatsappPlaceholder || "Masukkan nomor WhatsApp"}
                  className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  required
                  data-testid="input-whatsapp-number"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                disabled={checkCouponMutation.isPending}
                data-testid="button-check-coupon"
              >
                {checkCouponMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Mengecek...
                  </div>
                ) : (
                  "Cek Kupon"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <div className="mt-6">
            <Card className={`shadow-sm border ${
              result.isWinner 
                ? "border-green-200 bg-green-50" 
                : "border-gray-200 bg-gray-50"
            }`}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  result.isWinner ? "bg-green-500" : "bg-gray-500"
                }`}>
                  {result.isWinner ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Info className="w-6 h-6 text-white" />
                  )}
                </div>
                <p className={`text-lg font-semibold mb-3 ${
                  result.isWinner ? "text-green-800" : "text-gray-800"
                }`}>
                  {result.message}
                </p>
                {result.isWinner && result.prizeName && (
                  <>
                    <div className="bg-white rounded-lg p-4 mt-4 border border-green-200">
                      <p className="text-base font-semibold text-green-800 mb-3">
                        Hadiah: {result.prizeName}
                      </p>
                      {result.prizeBanner && (
                        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                          <div className="relative w-full" style={{ paddingBottom: '50%' }}>
                            <img 
                              src={result.prizeBanner} 
                              alt={`Hadiah ${result.prizeName}`}
                              className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                              data-testid="img-prize-banner"
                            />
                          </div>
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
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Syarat & Ketentuan</h3>
              <div className="text-xs sm:text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {settings.termsAndConditions}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* WhatsApp Admin Contact Button */}
      {settings?.adminWhatsApp && (
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 text-center">
          <Button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center gap-2 sm:gap-3 bg-green-600 hover:bg-green-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            data-testid="button-contact-admin-main"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span className="hidden xs:inline">Hubungi Admin WhatsApp</span>
            <span className="xs:hidden">WhatsApp Admin</span>
          </Button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 mb-6 sm:mb-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link href="/alamat-toko">
            <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200 cursor-pointer">
              <CardContent className="p-4 sm:p-6 text-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 sm:mb-3 text-primary" />
                <span className="text-gray-900 font-medium text-xs sm:text-sm">Alamat Toko</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/katalog-produk">
            <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200 cursor-pointer">
              <CardContent className="p-4 sm:p-6 text-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 sm:mb-3 text-primary" />
                <span className="text-gray-900 font-medium text-xs sm:text-sm">Katalog Produk</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Admin Access Button */}
      <Link href="/auth">
        <Button
          size="icon"
          className="fixed bottom-6 right-6 bg-gray-600 hover:bg-gray-700 shadow-lg"
          title="Admin Access"
          data-testid="button-admin-access"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
