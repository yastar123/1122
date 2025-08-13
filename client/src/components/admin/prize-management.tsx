import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Prize } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, Upload, Link } from "lucide-react";

export default function PrizeManagement() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    couponNumber: "",
    description: "",
    bannerUrl: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const { data: prizes = [], isLoading } = useQuery<Prize[]>({
    queryKey: ["/api/prizes"],
  });

  const createPrizeMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/prizes", {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prizes"] });
      setIsCreateModalOpen(false);
      resetForm();
      toast({
        title: "Berhasil",
        description: "Hadiah berhasil ditambahkan",
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

  const updatePrizeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const updateData = { ...data };
      if (data.startDate) updateData.startDate = new Date(data.startDate).toISOString();
      if (data.endDate) updateData.endDate = new Date(data.endDate).toISOString();
      
      const res = await apiRequest("PUT", `/api/prizes/${id}`, updateData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prizes"] });
      setEditingPrize(null);
      toast({
        title: "Berhasil",
        description: "Hadiah berhasil diperbarui",
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

  const deletePrizeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/prizes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prizes"] });
      toast({
        title: "Berhasil",
        description: "Hadiah berhasil dihapus",
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

  const resetForm = () => {
    setFormData({
      name: "",
      couponNumber: "",
      description: "",
      bannerUrl: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setBannerFile(null);
    setBannerPreview("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, bannerUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createPrizeMutation.mutate(formData);
  };

  const handleEdit = (prize: Prize) => {
    setEditingPrize(prize);
  };

  const handleUpdate = (field: string, value: any) => {
    if (editingPrize) {
      const updatedData = { [field]: value };
      updatePrizeMutation.mutate({
        id: editingPrize.id,
        data: updatedData,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus hadiah ini?")) {
      deletePrizeMutation.mutate(id);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("id-ID");
  };

  const formatDateForInput = (date: Date | string) => {
    return new Date(date).toISOString().slice(0, 16);
  };

  if (isLoading) {
    return <div>Memuat hadiah...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Kelola Hadiah</h2>
          <p className="text-gray-600 text-sm">Tambah, edit, dan hapus hadiah undian</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Hadiah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Hadiah Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Nama Hadiah</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: TUMBLR"
                  required
                  data-testid="input-prize-name"
                />
              </div>

              <div>
                <Label>Nomor Kupon</Label>
                <Input
                  value={formData.couponNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, couponNumber: e.target.value }))}
                  placeholder="Contoh: TUM001"
                  required
                  data-testid="input-coupon-number"
                />
              </div>
              
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi hadiah..."
                  data-testid="textarea-description"
                />
              </div>
              
              <div>
                <Label>Banner Hadiah</Label>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      URL Link
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      data-testid="input-banner-file"
                    />
                    {bannerPreview && (
                      <div className="mt-2">
                        <img 
                          src={bannerPreview} 
                          alt="Preview banner" 
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-2">
                    <Input
                      type="url"
                      value={formData.bannerUrl}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, bannerUrl: e.target.value }));
                        setBannerFile(null);
                        setBannerPreview("");
                      }}
                      placeholder="https://example.com/banner.png"
                      data-testid="input-banner-url"
                    />
                    {formData.bannerUrl && (
                      <div className="mt-2">
                        <img 
                          src={formData.bannerUrl} 
                          alt="Preview banner" 
                          className="w-full h-32 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yIGxvYWRpbmcgaW1hZ2U8L3RleHQ+PC9zdmc+";
                          }}
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Tanggal Selesai</Label>
                  <Input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-6"
                  disabled={createPrizeMutation.isPending}
                >
                  {createPrizeMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menambah...
                    </div>
                  ) : (
                    "Tambah Hadiah"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Hadiah</TableHead>
              <TableHead>Nomor Kupon</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead>Tanggal Mulai</TableHead>
              <TableHead>Tanggal Selesai</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prizes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Belum ada hadiah. Tambah hadiah pertama Anda.
                </TableCell>
              </TableRow>
            ) : (
              prizes.map((prize) => (
                <TableRow key={prize.id}>
                  <TableCell>
                    {editingPrize?.id === prize.id ? (
                      <Input
                        defaultValue={prize.name}
                        onBlur={(e) => handleUpdate("name", e.target.value)}
                        className="max-w-32"
                        data-testid={`input-edit-name-${prize.id}`}
                      />
                    ) : (
                      <span className="font-medium">{prize.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPrize?.id === prize.id ? (
                      <Input
                        defaultValue={prize.couponNumber}
                        onBlur={(e) => handleUpdate("couponNumber", e.target.value)}
                        className="max-w-32"
                        data-testid={`input-edit-coupon-${prize.id}`}
                      />
                    ) : (
                      <span className="font-mono font-medium text-blue-600">{prize.couponNumber}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {prize.bannerUrl ? (
                      <img src={prize.bannerUrl} alt="Banner" className="w-12 h-8 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                        No Banner
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPrize?.id === prize.id ? (
                      <Input
                        type="datetime-local"
                        defaultValue={formatDateForInput(prize.startDate)}
                        onBlur={(e) => handleUpdate("startDate", e.target.value)}
                        className="max-w-40"
                      />
                    ) : (
                      <span className="text-sm">{formatDate(prize.startDate)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPrize?.id === prize.id ? (
                      <Input
                        type="datetime-local"
                        defaultValue={formatDateForInput(prize.endDate)}
                        onBlur={(e) => handleUpdate("endDate", e.target.value)}
                        className="max-w-40"
                      />
                    ) : (
                      <span className="text-sm">{formatDate(prize.endDate)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={prize.isActive ? "default" : "secondary"}>
                      {prize.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingPrize?.id === prize.id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPrize(null)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(prize)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(prize.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}