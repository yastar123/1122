import { useQuery } from "@tanstack/react-query";
import { Package, Tag, Check, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProductCatalog } from "@shared/schema";

export default function ProductCatalogPage() {
  const { data: products = [], isLoading } = useQuery<ProductCatalog[]>({
    queryKey: ["/api/products"],
  });

  const activeProducts = products.filter(product => product.isActive);
  const categories = Array.from(new Set(activeProducts.map(p => p.category).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat katalog produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Katalog Produk</h1>
            <p className="text-gray-600 mt-1">Jelajahi berbagai produk printing berkualitas dari ConnectPrinting</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Semua Kategori
              </Badge>
              {categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada produk</h3>
            <p className="mt-2 text-gray-600">Katalog produk akan ditampilkan di sini.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {product.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {product.isAvailable ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  {product.category && (
                    <Badge variant="secondary" className="w-fit">
                      {product.category}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.description && (
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    {product.price && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-blue-600">{product.price}</span>
                      </div>
                    )}
                    
                    <Badge variant={product.isAvailable ? "default" : "destructive"}>
                      {product.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}