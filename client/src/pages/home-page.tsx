import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon, Gift, CheckCircle, Info, MessageCircle, ExternalLink } from "lucide-react";
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
      window.open(`https://${settings.adminWhatsApp}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-brand-green-light rounded-full flex items-center justify-center">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <Gift className="text-brand-green text-2xl" />
            )}
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            {settings?.siteTitle || "Cek Kupon Undian"}
          </h1>
        </div>
      </div>

      {/* Banner Section */}
      <div className="max-w-md mx-auto px-6 mt-4">
        <div className="relative h-32 rounded-lg overflow-hidden shadow-lg">
          {settings?.bannerUrl ? (
            <img src={settings.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-brand-green to-brand-green-dark flex items-center justify-center">
              <Gift className="text-white text-4xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-green/20 to-transparent"></div>
        </div>
      </div>

      {/* Main Coupon Check Form */}
      <div className="max-w-md mx-auto px-6 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Tulis Nomor kuponmu disini <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Masukkan nomor kupon"
                  className="mt-2"
                  value={formData.couponNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, couponNumber: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="mt-2"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Nomor Whatsapp <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  className="mt-2"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-dark"
                disabled={checkCouponMutation.isPending}
              >
                {checkCouponMutation.isPending ? "Mengecek..." : "CEK"}
              </Button>
            </form>

            {/* Result Display */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg border ${
                result.isWinner 
                  ? "bg-green-50 border-green-200" 
                  : "bg-yellow-50 border-yellow-200"
              }`}>
                <div className="flex items-center">
                  {result.isWinner ? (
                    <CheckCircle className="text-green-500 mr-3" />
                  ) : (
                    <Info className="text-yellow-500 mr-3" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${
                      result.isWinner ? "text-green-800" : "text-yellow-800"
                    }`}>
                      {result.isWinner ? "Selamat!" : "Maaf"}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      result.isWinner ? "text-green-700" : "text-yellow-700"
                    }`}>
                      {result.message}
                    </p>
                    {result.isWinner && result.prizeName && (
                      <p className="text-sm font-medium text-green-800 mt-1">
                        Hadiah: {result.prizeName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <div className="max-w-md mx-auto px-6 pb-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Hadiah Tersedia</h2>
            <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
              <Gift className="text-white text-4xl" />
            </div>
            
            {settings?.termsAndConditions && (
              <div className="text-sm text-gray-600 whitespace-pre-line">
                {settings.termsAndConditions}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Admin Button */}
      {settings?.adminWhatsApp && (
        <div className="max-w-md mx-auto px-6 pb-8">
          <Button
            onClick={handleWhatsAppContact}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Hubungi Admin
          </Button>
        </div>
      )}

      {/* Maps Link */}
      {settings?.mapsLink && (
        <div className="max-w-md mx-auto px-6 pb-8">
          <Button
            onClick={() => window.open(settings.mapsLink!, "_blank")}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Lihat Lokasi
          </Button>
        </div>
      )}

      {/* Admin Access Button */}
      <Link href="/auth">
        <Button
          size="icon"
          className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-900 shadow-lg"
          title="Admin Access"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
