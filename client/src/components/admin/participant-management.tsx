import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Participant, Prize } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, Search } from "lucide-react";

export default function ParticipantManagement() {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    couponNumber: "",
    prizeId: "",
    isWinner: false,
    notes: "",
  });

  const { data: participants = [], isLoading } = useQuery<Participant[]>({
    queryKey: ["/api/participants"],
  });

  const { data: prizes = [] } = useQuery<Prize[]>({
    queryKey: ["/api/prizes"],
  });

  const createParticipantMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/participants", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/participants"] });
      setIsCreateModalOpen(false);
      resetForm();
      toast({
        title: "Berhasil",
        description: "ID peserta berhasil ditambahkan",
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

  const updateParticipantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const res = await apiRequest("PUT", `/api/participants/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/participants"] });
      setEditingParticipant(null);
      toast({
        title: "Berhasil",
        description: "Peserta berhasil diperbarui",
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

  const deleteParticipantMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/participants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/participants"] });
      toast({
        title: "Berhasil",
        description: "Peserta berhasil dihapus",
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
      couponNumber: "",
      prizeId: "",
      isWinner: false,
      notes: "",
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createParticipantMutation.mutate(formData);
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
  };

  const handleUpdate = (field: string, value: any) => {
    if (editingParticipant) {
      const updatedData = { [field]: value };
      updateParticipantMutation.mutate({
        id: editingParticipant.id,
        data: updatedData,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus peserta ini?")) {
      deleteParticipantMutation.mutate(id);
    }
  };

  const getPrizeName = (prizeId: string | null) => {
    if (!prizeId) return "Tidak ada hadiah";
    const prize = prizes.find(p => p.id === prizeId);
    return prize?.name || "Hadiah tidak ditemukan";
  };

  const filteredParticipants = participants.filter(participant =>
    participant.couponNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getPrizeName(participant.prizeId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Memuat peserta...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Kelola Peserta</h2>
          <p className="text-gray-600 text-sm">Tambah ID peserta dan tentukan pemenang</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-green hover:bg-brand-green-dark">
              <Plus className="h-4 w-4 mr-2" />
              Tambah ID
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah ID Peserta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Nomor Kupon</Label>
                <Input
                  value={formData.couponNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, couponNumber: e.target.value }))}
                  placeholder="Contoh: 63165463"
                  required
                />
              </div>
              
              <div>
                <Label>Hadiah (opsional)</Label>
                <Select
                  value={formData.prizeId}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    prizeId: value,
                    isWinner: value !== ""
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih hadiah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tidak ada hadiah</SelectItem>
                    {prizes.map(prize => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Catatan</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Catatan tambahan..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-brand-green hover:bg-brand-green-dark"
                  disabled={createParticipantMutation.isPending}
                >
                  {createParticipantMutation.isPending ? "Menambah..." : "Tambah ID"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Cari berdasarkan nomor kupon atau hadiah..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Kupon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hadiah</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada peserta. Tambah ID peserta pertama Anda."}
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    {editingParticipant?.id === participant.id ? (
                      <Input
                        defaultValue={participant.couponNumber}
                        onBlur={(e) => handleUpdate("couponNumber", e.target.value)}
                        className="max-w-32"
                      />
                    ) : (
                      <span className="font-mono">{participant.couponNumber}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={participant.isWinner ? "default" : "secondary"}>
                      {participant.isWinner ? "Pemenang" : "Tidak Menang"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingParticipant?.id === participant.id ? (
                      <Select
                        defaultValue={participant.prizeId || ""}
                        onValueChange={(value) => {
                          handleUpdate("prizeId", value || null);
                          handleUpdate("isWinner", value !== "");
                        }}
                      >
                        <SelectTrigger className="max-w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tidak ada hadiah</SelectItem>
                          {prizes.map(prize => (
                            <SelectItem key={prize.id} value={prize.id}>
                              {prize.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm">{getPrizeName(participant.prizeId)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingParticipant?.id === participant.id ? (
                      <Textarea
                        defaultValue={participant.notes || ""}
                        onBlur={(e) => handleUpdate("notes", e.target.value)}
                        className="max-w-48"
                        rows={2}
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{participant.notes || "-"}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingParticipant?.id === participant.id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingParticipant(null)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(participant)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(participant.id)}
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