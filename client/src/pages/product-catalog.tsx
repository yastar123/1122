import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Tag, Check, X, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { ProductCatalog } from "@shared/schema";

export default function ProductCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery<ProductCatalog[]>({
    queryKey: ["/api/products"],
  });

  const activeProducts = products.filter(product => product.isActive);
  const categories = Array.from(new Set(activeProducts.map(p => p.category).filter(Boolean)));

  const filteredProducts = useMemo(() => {
    let filtered = activeProducts;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [activeProducts, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat katalog produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Katalog Produk</h1>
            <p className="text-gray-600 mt-2">Jelajahi berbagai produk berkualitas</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                data-testid="input-search-products"
              />
            </div>

            {/* Categories Filter */}
            {categories.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 text-center">Filter berdasarkan kategori:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Badge 
                    variant={selectedCategory === null ? "default" : "outline"}
                    className="cursor-pointer hover:bg-gray-100 transition-colors px-4 py-2 text-sm font-medium"
                    onClick={() => setSelectedCategory(null)}
                    data-testid="filter-category-all"
                  >
                    Semua ({activeProducts.length})
                  </Badge>
                  {categories.map((category) => (
                    <Badge 
                      key={category} 
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer hover:bg-gray-100 transition-colors px-4 py-2 text-sm font-medium"
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`filter-category-${category?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results Counter */}
            <div className="text-center">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                Menampilkan {filteredProducts.length} dari {activeProducts.length} produk
                {searchQuery && ` untuk "${searchQuery}"`}
                {selectedCategory && ` di kategori "${selectedCategory}"`}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchQuery || selectedCategory ? "Tidak ada produk yang ditemukan" : "Belum ada produk"}
            </h3>
            <p className="mt-2 text-gray-600">
              {searchQuery || selectedCategory 
                ? "Coba ubah kata kunci pencarian atau filter kategori"
                : "Katalog produk akan ditampilkan di sini."
              }
            </p>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-4"
                data-testid="button-clear-filters"
              >
                Hapus Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {product.imageUrl && (
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}
                <CardHeader className="pb-3">
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