import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Package, Tag, Check, X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import type { ProductCatalog, InsertProductCatalog } from "@shared/schema";

export default function ProductCatalogManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductCatalog | null>(null);

  const form = useForm<InsertProductCatalog>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "",
      isAvailable: true,
      isActive: true,
    },
  });

  const { data: products = [], isLoading } = useQuery<ProductCatalog[]>({
    queryKey: ["/api/products"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProductCatalog) => {
      const res = await apiRequest("POST", "/api/products", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      toast({
        title: "Berhasil",
        description: editingProduct ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan",
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

  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<InsertProductCatalog> }) => {
      const res = await apiRequest("PUT", `/api/products/${data.id}`, data.updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      toast({
        title: "Berhasil",
        description: "Produk berhasil diperbarui",
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

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/products/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Berhasil",
        description: "Produk berhasil dihapus",
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

  const onSubmit = (data: InsertProductCatalog) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, updates: data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEdit = (product: ProductCatalog) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      price: product.price || "",
      imageUrl: product.imageUrl || "",
      category: product.category || "",
      isAvailable: product.isAvailable || true,
      isActive: product.isActive || true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const openNewDialog = () => {
    setEditingProduct(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleFileUpload = () => {
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
          form.setValue('imageUrl', reader.result as string);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Katalog Produk</h2>
          <p className="text-gray-600">Kelola produk dan layanan yang ditawarkan</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk *</FormLabel>
                      <FormControl>
                        <Input placeholder="Banner Custom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Deskripsi produk atau layanan"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga</FormLabel>
                        <FormControl>
                          <Input placeholder="Rp 50.000 - 200.000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <FormControl>
                          <Input placeholder="Advertising, Sticker, Apparel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gambar Produk</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/image.jpg atau upload gambar" 
                              {...field} 
                              className="flex-1"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleFileUpload}
                            data-testid="button-upload-product-image"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        {field.value && (
                          <div className="mt-2">
                            <img 
                              src={field.value} 
                              alt="Preview" 
                              className="w-32 h-24 object-cover rounded border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Tersedia</FormLabel>
                          <div className="text-sm text-gray-600">
                            Produk tersedia untuk dijual
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Status Aktif</FormLabel>
                          <div className="text-sm text-gray-600">
                            Produk ditampilkan di katalog
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    className="flex-1"
                  >
                    {createProductMutation.isPending || updateProductMutation.isPending 
                      ? "Menyimpan..." 
                      : editingProduct ? "Update" : "Simpan"
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-gray-600">Total Produk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Produk Aktif</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.isAvailable).length}
            </div>
            <div className="text-sm text-gray-600">Tersedia</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Kategori</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada produk</h3>
              <p className="mt-2 text-gray-600">Mulai dengan menambahkan produk pertama ke katalog.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category && (
                        <Badge variant="secondary">{product.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.price && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span className="text-sm">{product.price}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {product.isAvailable ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <X className="h-3 w-3 text-red-600" />
                          )}
                          <span className="text-xs">
                            {product.isAvailable ? "Tersedia" : "Habis"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}