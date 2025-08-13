import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, InsertSettings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlaceholderManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<InsertSettings>({});

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteTitle: settings.siteTitle,
        logoUrl: settings.logoUrl,
        bannerUrl: settings.bannerUrl,
        adminWhatsApp: settings.adminWhatsApp,
        mapsLink: settings.mapsLink,
        termsAndConditions: settings.termsAndConditions,
        winnerMessage: settings.winnerMessage,
        couponPlaceholder: settings.couponPlaceholder,
        namePlaceholder: settings.namePlaceholder,
        whatsappPlaceholder: settings.whatsappPlaceholder,
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: InsertSettings) => {
      const res = await apiRequest("PUT", "/api/settings", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Berhasil",
        description: "Placeholder berhasil diperbarui",
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
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Memuat...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Kelola Placeholder Teks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="couponPlaceholder">Placeholder Nomor Kupon</Label>
            <Input
              id="couponPlaceholder"
              type="text"
              value={formData.couponPlaceholder || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, couponPlaceholder: e.target.value }))}
              placeholder="Tulis Nomor kuponmu disini"
              data-testid="input-coupon-placeholder"
            />
          </div>

          <div>
            <Label htmlFor="namePlaceholder">Placeholder Nama Lengkap</Label>
            <Input
              id="namePlaceholder"
              type="text"
              value={formData.namePlaceholder || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, namePlaceholder: e.target.value }))}
              placeholder="Nama Lengkap"
              data-testid="input-name-placeholder"
            />
          </div>

          <div>
            <Label htmlFor="whatsappPlaceholder">Placeholder Nomor WhatsApp</Label>
            <Input
              id="whatsappPlaceholder"
              type="text"
              value={formData.whatsappPlaceholder || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsappPlaceholder: e.target.value }))}
              placeholder="Nomor Whatsapp"
              data-testid="input-whatsapp-placeholder"
            />
          </div>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            data-testid="button-save-placeholders"
          >
            <Save className="mr-2 h-4 w-4" />
            {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}