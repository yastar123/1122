import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import type { StoreAddress, InsertStoreAddress } from "@shared/schema";

export default function StoreAddressManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreAddress | null>(null);

  const form = useForm<InsertStoreAddress>({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      whatsapp: "",
      openingHours: "",
      mapsLink: "",
      isActive: true,
    },
  });

  const { data: storeAddresses = [], isLoading } = useQuery<StoreAddress[]>({
    queryKey: ["/api/store-addresses"],
  });

  const createStoreMutation = useMutation({
    mutationFn: async (data: InsertStoreAddress) => {
      const res = await apiRequest("POST", "/api/store-addresses", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-addresses"] });
      setIsDialogOpen(false);
      setEditingStore(null);
      form.reset();
      toast({
        title: "Berhasil",
        description: editingStore ? "Alamat toko berhasil diperbarui" : "Alamat toko berhasil ditambahkan",
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

  const updateStoreMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<InsertStoreAddress> }) => {
      const res = await apiRequest("PUT", `/api/store-addresses/${data.id}`, data.updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-addresses"] });
      setIsDialogOpen(false);
      setEditingStore(null);
      form.reset();
      toast({
        title: "Berhasil",
        description: "Alamat toko berhasil diperbarui",
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

  const deleteStoreMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/store-addresses/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/store-addresses"] });
      toast({
        title: "Berhasil",
        description: "Alamat toko berhasil dihapus",
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

  const onSubmit = (data: InsertStoreAddress) => {
    if (editingStore) {
      updateStoreMutation.mutate({ id: editingStore.id, updates: data });
    } else {
      createStoreMutation.mutate(data);
    }
  };

  const handleEdit = (store: StoreAddress) => {
    setEditingStore(store);
    form.reset({
      name: store.name,
      address: store.address,
      phone: store.phone || "",
      whatsapp: store.whatsapp || "",
      openingHours: store.openingHours || "",
      mapsLink: store.mapsLink || "",
      isActive: store.isActive || true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat toko ini?")) {
      deleteStoreMutation.mutate(id);
    }
  };

  const openNewDialog = () => {
    setEditingStore(null);
    form.reset();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat alamat toko...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Alamat Toko</h2>
          <p className="text-gray-600">Kelola informasi lokasi toko dan cabang</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Alamat Toko
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStore ? "Edit Alamat Toko" : "Tambah Alamat Toko Baru"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Toko *</FormLabel>
                      <FormControl>
                        <Input placeholder="ConnectPrinting Pusat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Jl. Sudirman No. 123, Jakarta Pusat"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="021-1234567" 
                            value={field.value || ""} 
                            onChange={field.onChange} 
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="6281234567890" 
                            value={field.value || ""} 
                            onChange={field.onChange} 
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="openingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jam Operasional</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Senin - Sabtu: 08:00 - 17:00"
                          rows={2}
                          value={field.value || ""} 
                          onChange={field.onChange} 
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mapsLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Google Maps</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://maps.google.com/..." 
                          value={field.value || ""} 
                          onChange={field.onChange} 
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
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
                          Toko ini akan ditampilkan di halaman publik
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createStoreMutation.isPending || updateStoreMutation.isPending}
                    className="flex-1"
                  >
                    {createStoreMutation.isPending || updateStoreMutation.isPending 
                      ? "Menyimpan..." 
                      : editingStore ? "Update" : "Simpan"
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

      {/* Store Addresses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Alamat Toko ({storeAddresses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {storeAddresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada alamat toko</h3>
              <p className="mt-2 text-gray-600">Mulai dengan menambahkan alamat toko pertama.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Toko</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeAddresses.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="font-medium">{store.name}</div>
                      {store.openingHours && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {store.openingHours.split('\n')[0]}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{store.address}</div>
                      {store.mapsLink && (
                        <a 
                          href={store.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Lihat di Maps
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {store.phone && (
                          <div className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {store.phone}
                          </div>
                        )}
                        {store.whatsapp && (
                          <div className="text-sm text-green-600">
                            WA: {store.whatsapp}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        store.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {store.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(store)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(store.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={deleteStoreMutation.isPending}
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