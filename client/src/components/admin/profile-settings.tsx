import { useState } from "react";
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
    logoUrl: "",
    bannerUrl: "",
    adminWhatsApp: "",
    mapsLink: "",
    termsAndConditions: "",
    winnerMessage: "",
  });

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
    onSuccess: (data) => {
      if (data) {
        setFormData({
          siteTitle: data.siteTitle || "",
          logoUrl: data.logoUrl || "",
          bannerUrl: data.bannerUrl || "",
          adminWhatsApp: data.adminWhatsApp || "",
          mapsLink: data.mapsLink || "",
          termsAndConditions: data.termsAndConditions || "",
          winnerMessage: data.winnerMessage || "",
        });
      }
    }
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Memuat pengaturan...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="siteTitle">Judul Website</Label>
          <Input
            id="siteTitle"
            value={formData.siteTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, siteTitle: e.target.value }))}
            placeholder="Cek Kupon Undian"
          />
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
          <Label htmlFor="logoUrl">URL Logo</Label>
          <Input
            id="logoUrl"
            type="url"
            value={formData.logoUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
            placeholder="https://example.com/logo.png"
          />
          <p className="text-sm text-gray-600 mt-1">
            Upload gambar ke layanan hosting dan masukkan URL-nya
          </p>
        </div>

        <div>
          <Label htmlFor="bannerUrl">URL Banner</Label>
          <Input
            id="bannerUrl"
            type="url"
            value={formData.bannerUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))}
            placeholder="https://example.com/banner.png"
          />
          <p className="text-sm text-gray-600 mt-1">
            Upload gambar ke layanan hosting dan masukkan URL-nya
          </p>
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

      <Button
        type="submit"
        className="bg-brand-green hover:bg-brand-green-dark"
        disabled={updateSettingsMutation.isPending}
      >
        <Save className="h-4 w-4 mr-2" />
        {updateSettingsMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
