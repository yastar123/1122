import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save } from "lucide-react";

export default function ProfileSettings() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    siteTitle: "",
    siteName: "",
    mainHeading: "",
    logoUrl: "",
    bannerUrl: "",
    adminWhatsApp: "",
    mapsLink: "",
    termsAndConditions: "",
    winnerMessage: "",
  });

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteTitle: settings.siteTitle || "",
        siteName: settings.siteName || "",
        mainHeading: settings.mainHeading || "",
        logoUrl: settings.logoUrl || "",
        bannerUrl: settings.bannerUrl || "",
        adminWhatsApp: settings.adminWhatsApp || "",
        mapsLink: settings.mapsLink || "",
        termsAndConditions: settings.termsAndConditions || "",
        winnerMessage: settings.winnerMessage || "",
      });
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PUT", "/api/settings", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Berhasil",
        description: "Pengaturan telah disimpan",
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

  const handleFileUpload = (field: 'logoUrl' | 'bannerUrl') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File Terlalu Besar",
            description: "Ukuran file maksimal 5MB. Silakan kompres gambar terlebih dahulu.",
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setFormData(prev => ({ ...prev, [field]: reader.result as string }));
        };
        reader.onerror = () => {
          toast({
            title: "Gagal Memuat File",
            description: "Terjadi kesalahan saat memuat file. Silakan coba lagi.",
            variant: "destructive",
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Memuat pengaturan...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Teks Halaman Utama
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="mainHeading">Judul Utama Halaman</Label>
            <Input
              id="mainHeading"
              value={formData.mainHeading}
              onChange={(e) => setFormData(prev => ({ ...prev, mainHeading: e.target.value }))}
              placeholder="Cek Kupon Undian"
            />
            <p className="text-xs text-gray-500 mt-1">Teks besar yang tampil di bagian atas</p>
          </div>

          <div>
            <Label htmlFor="siteName">Nama Sistem/Subjudul</Label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
              placeholder="Sistem Undian Kupon"
            />
            <p className="text-xs text-gray-500 mt-1">Teks kecil yang tampil di bawah judul utama</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
          Pengaturan Umum
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="siteTitle">Judul Website (Tab Browser)</Label>
            <Input
              id="siteTitle"
              value={formData.siteTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, siteTitle: e.target.value }))}
              placeholder="Cek Kupon Undian"
            />
            <p className="text-xs text-gray-500 mt-1">Tampil di tab browser</p>
          </div>

          <div>
            <Label htmlFor="adminWhatsApp">WhatsApp Admin</Label>
            <Input
              id="adminWhatsApp"
              value={formData.adminWhatsApp}
              onChange={(e) => setFormData(prev => ({ ...prev, adminWhatsApp: e.target.value }))}
              placeholder="wa.me/62651465165651"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="mapsLink">Link Peta Lokasi</Label>
        <Input
          id="mapsLink"
          type="url"
          value={formData.mapsLink}
          onChange={(e) => setFormData(prev => ({ ...prev, mapsLink: e.target.value }))}
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Logo</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="https://example.com/logo.png"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleFileUpload('logoUrl')}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {formData.logoUrl && (
              <div className="mt-2">
                <img src={formData.logoUrl} alt="Logo Preview" className="w-16 h-16 object-cover rounded" />
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>Banner</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))}
                placeholder="https://example.com/banner.png"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleFileUpload('bannerUrl')}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {formData.bannerUrl && (
              <div className="mt-2">
                <img src={formData.bannerUrl} alt="Banner Preview" className="w-32 h-20 object-cover rounded" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="winnerMessage">Pesan Pemenang</Label>
        <Input
          id="winnerMessage"
          value={formData.winnerMessage}
          onChange={(e) => setFormData(prev => ({ ...prev, winnerMessage: e.target.value }))}
          placeholder="Anda mendapatkan hadiah dari ConnectPrinting, segera tukarkan :)"
        />
      </div>

      <div>
        <Label htmlFor="termsAndConditions">Syarat & Ketentuan</Label>
        <Textarea
          id="termsAndConditions"
          rows={8}
          value={formData.termsAndConditions}
          onChange={(e) => setFormData(prev => ({ ...prev, termsAndConditions: e.target.value }))}
          placeholder="Cara Klaim Hadiahmu..."
        />
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
          disabled={updateSettingsMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettingsMutation.isPending ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Menyimpan...
            </div>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
}