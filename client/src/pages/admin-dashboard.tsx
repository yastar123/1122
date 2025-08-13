import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Settings, Gift, Users, History, LogOut, FileText, MapPin, Package } from "lucide-react";
import ProfileSettings from "@/components/admin/profile-settings";
import PrizeManagement from "@/components/admin/prize-management";
import ParticipantManagement from "@/components/admin/participant-management";
import SubmissionHistory from "@/components/admin/submission-history";
import PlaceholderManagement from "@/components/admin/placeholder-management";
import StoreAddressManagement from "@/components/admin/store-address-management";
import ProductCatalogManagement from "@/components/admin/product-catalog-management";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Sistem Undian Kupon</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-6">
        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full min-w-max grid-cols-7 h-auto p-1">
              <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="placeholder" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">Placeholder</span>
              </TabsTrigger>
              <TabsTrigger value="prizes" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">Hadiah</span>
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">Peserta</span>
              </TabsTrigger>
              <TabsTrigger value="stores" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap hidden sm:inline">Alamat Toko</span>
                <span className="whitespace-nowrap sm:hidden">Toko</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">Produk</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <History className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">Riwayat</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placeholder" className="space-y-6">
            <PlaceholderManagement />
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Hadiah</CardTitle>
              </CardHeader>
              <CardContent>
                <PrizeManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Peserta</CardTitle>
              </CardHeader>
              <CardContent>
                <ParticipantManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-6">
            <StoreAddressManagement />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductCatalogManagement />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pengajuan</CardTitle>
              </CardHeader>
              <CardContent>
                <SubmissionHistory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
