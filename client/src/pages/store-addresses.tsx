import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoreAddress } from "@shared/schema";

export default function StoreAddressesPage() {
  const { data: storeAddresses = [], isLoading } = useQuery<StoreAddress[]>({
    queryKey: ["/api/store-addresses"],
  });

  const activeStores = storeAddresses.filter(store => store.isActive);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat alamat toko...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Alamat Toko</h1>
            <p className="text-gray-600 mt-2">Temukan lokasi toko terdekat</p>
          </div>
        </div>
      </div>

      {/* Store Addresses */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {activeStores.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada alamat toko</h3>
            <p className="mt-2 text-gray-600">Informasi alamat toko akan ditampilkan di sini.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeStores.map((store) => (
              <Card key={store.id} className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <CardHeader className="bg-primary text-white">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4" />
                    </div>
                    {store.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Alamat</p>
                        <p className="text-sm text-gray-600">{store.address}</p>
                      </div>
                    </div>

                    {store.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Telepon</p>
                          <a 
                            href={`tel:${store.phone}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {store.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {store.whatsapp && (
                      <div className="flex items-center gap-3">
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.012 2c5.518 0 9.998 4.48 9.998 9.998 0 1.78-.47 3.45-1.293 4.89L22 22l-5.112-1.283c-1.44.823-3.11 1.293-4.89 1.293C6.48 22.01 2 17.53 2 12.012 2 6.494 6.48 2.014 12.012 2zm-1.268 7.874c-.26 0-.468.208-.468.468v3.124c0 .26.208.468.468.468h2.536c.26 0 .468-.208.468-.468V10.342c0-.26-.208-.468-.468-.468h-2.536z"/>
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                          <a 
                            href={`https://wa.me/${store.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:underline"
                          >
                            Chat WhatsApp
                          </a>
                        </div>
                      </div>
                    )}

                    {store.openingHours && (
                      <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Jam Buka</p>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{store.openingHours}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {store.mapsLink && (
                    <div className="pt-4 border-t">
                      <a
                        href={store.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Lihat di Google Maps
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}