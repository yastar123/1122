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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Search, Filter, Phone, Clock, Gift, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ParticipantManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [prizeFilter, setPrizeFilter] = useState("all");
  const [editingField, setEditingField] = useState<{participantId: string, field: string} | null>(null);

  const { data: participants = [], isLoading } = useQuery<Participant[]>({
    queryKey: ["/api/participants", prizeFilter],
    queryFn: async () => {
      const params = prizeFilter && prizeFilter !== "all" ? `?prizeName=${encodeURIComponent(prizeFilter)}` : '';
      const res = await fetch(`/api/participants${params}`);
      if (!res.ok) throw new Error('Failed to fetch participants');
      return res.json();
    },
  });

  const { data: prizes = [] } = useQuery<Prize[]>({
    queryKey: ["/api/prizes"],
  });

  const updateParticipantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Participant> }) => {
      const res = await apiRequest("PUT", `/api/participants/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/participants"] });
      setEditingField(null);
      toast({
        title: "Berhasil",
        description: "Data peserta berhasil diperbarui",
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

  const handleClaimStatusToggle = (participant: Participant) => {
    if (!participant.isWinner) {
      toast({
        title: "Info",
        description: "Status pengambilan hanya bisa diubah untuk pemenang hadiah",
        variant: "default",
      });
      return;
    }

    updateParticipantMutation.mutate({
      id: participant.id,
      data: { isPrizeClaimed: !participant.isPrizeClaimed },
    });
  };

  const handleFieldUpdate = (participantId: string, field: string, value: any) => {
    updateParticipantMutation.mutate({
      id: participantId,
      data: { [field]: value },
    });
  };

  const isEditing = (participantId: string, field: string) => {
    return editingField?.participantId === participantId && editingField?.field === field;
  };

  const startEditing = (participantId: string, field: string) => {
    setEditingField({ participantId, field });
  };

  const stopEditing = () => {
    setEditingField(null);
  };

  const filteredParticipants = participants.filter(participant =>
    participant.couponNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (participant.prizeName && participant.prizeName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTimeAgo = (date: string | Date | null) => {
    if (!date) return "-";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "-";
    }
  };

  const uniquePrizeNames = Array.from(new Set(
    participants
      .filter(p => p.prizeName)
      .map(p => p.prizeName!)
  )).sort();

  if (isLoading) {
    return <div>Memuat peserta...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Daftar Peserta</h2>
          <p className="text-gray-600 text-sm">Kelola data peserta dan status pengambilan hadiah</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama, nomor kupon, atau hadiah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={prizeFilter} onValueChange={setPrizeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter berdasarkan hadiah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua hadiah</SelectItem>
              {uniquePrizeNames.map(prizeName => (
                <SelectItem key={prizeName} value={prizeName}>
                  {prizeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{participants.length}</div>
          <div className="text-sm text-gray-600">Total Peserta</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {participants.filter(p => p.isWinner).length}
          </div>
          <div className="text-sm text-gray-600">Pemenang</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">
            {participants.filter(p => p.isWinner && p.isPrizeClaimed).length}
          </div>
          <div className="text-sm text-gray-600">Hadiah Diambil</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {participants.filter(p => p.isWinner && !p.isPrizeClaimed).length}
          </div>
          <div className="text-sm text-gray-600">Belum Diambil</div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>No. WhatsApp</TableHead>
              <TableHead>Nomor Kupon</TableHead>
              <TableHead>Waktu Input</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hadiah</TableHead>
              <TableHead>Pengambilan</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  {searchQuery || prizeFilter ? "Tidak ada hasil yang ditemukan" : "Belum ada peserta"}
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  {/* Nama */}
                  <TableCell>
                    {isEditing(participant.id, "fullName") ? (
                      <Input
                        defaultValue={participant.fullName}
                        onBlur={(e) => handleFieldUpdate(participant.id, "fullName", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleFieldUpdate(participant.id, "fullName", e.currentTarget.value);
                          } else if (e.key === "Escape") {
                            stopEditing();
                          }
                        }}
                        autoFocus
                        className="font-medium"
                      />
                    ) : (
                      <div 
                        className="font-medium cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => startEditing(participant.id, "fullName")}
                      >
                        {participant.fullName}
                      </div>
                    )}
                  </TableCell>
                  
                  {/* No. WhatsApp */}
                  <TableCell>
                    {isEditing(participant.id, "whatsappNumber") ? (
                      <Input
                        defaultValue={participant.whatsappNumber}
                        onBlur={(e) => handleFieldUpdate(participant.id, "whatsappNumber", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleFieldUpdate(participant.id, "whatsappNumber", e.currentTarget.value);
                          } else if (e.key === "Escape") {
                            stopEditing();
                          }
                        }}
                        autoFocus
                        className="font-mono text-sm"
                      />
                    ) : (
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => startEditing(participant.id, "whatsappNumber")}
                      >
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-sm">{participant.whatsappNumber}</span>
                      </div>
                    )}
                  </TableCell>
                  
                  {/* Nomor Kupon */}
                  <TableCell>
                    {isEditing(participant.id, "couponNumber") ? (
                      <Input
                        defaultValue={participant.couponNumber}
                        onBlur={(e) => handleFieldUpdate(participant.id, "couponNumber", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleFieldUpdate(participant.id, "couponNumber", e.currentTarget.value);
                          } else if (e.key === "Escape") {
                            stopEditing();
                          }
                        }}
                        autoFocus
                        className="font-mono text-sm"
                      />
                    ) : (
                      <span 
                        className="font-mono bg-gray-100 px-2 py-1 rounded text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => startEditing(participant.id, "couponNumber")}
                      >
                        {participant.couponNumber}
                      </span>
                    )}
                  </TableCell>
                  
                  {/* Waktu Input */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{formatTimeAgo(participant.createdAt)}</span>
                    </div>
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell>
                    <Badge variant={participant.isWinner ? "default" : "secondary"}>
                      {participant.isWinner ? "Pemenang" : "Tidak Menang"}
                    </Badge>
                  </TableCell>
                  
                  {/* Hadiah */}
                  <TableCell>
                    {isEditing(participant.id, "prizeName") ? (
                      <Select
                        defaultValue={participant.prizeName || ""}
                        onValueChange={(value) => {
                          const isWinner = value !== "";
                          const prizeData = prizes.find(p => p.name === value);
                          handleFieldUpdate(participant.id, "prizeName", value || null);
                          handleFieldUpdate(participant.id, "prizeId", prizeData?.id || null);
                          handleFieldUpdate(participant.id, "isWinner", isWinner);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih hadiah" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-prize">Tidak ada hadiah</SelectItem>
                          {prizes.map(prize => (
                            <SelectItem key={prize.id} value={prize.name}>
                              {prize.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div 
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => startEditing(participant.id, "prizeName")}
                      >
                        {participant.prizeName ? (
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{participant.prizeName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  
                  {/* Pengambilan */}
                  <TableCell>
                    {participant.isWinner ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={participant.isPrizeClaimed || false}
                          onCheckedChange={() => handleClaimStatusToggle(participant)}
                          disabled={updateParticipantMutation.isPending}
                        />
                        <span className="text-sm">
                          {participant.isPrizeClaimed ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Sudah diambil
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-orange-600">
                              <XCircle className="h-4 w-4" />
                              Belum diambil
                            </div>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  
                  {/* Keterangan */}
                  <TableCell>
                    {isEditing(participant.id, "notes") ? (
                      <Textarea
                        defaultValue={participant.notes || ""}
                        onBlur={(e) => handleFieldUpdate(participant.id, "notes", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleFieldUpdate(participant.id, "notes", e.currentTarget.value);
                          } else if (e.key === "Escape") {
                            stopEditing();
                          }
                        }}
                        autoFocus
                        className="text-sm min-h-[60px]"
                        rows={2}
                      />
                    ) : (
                      <div 
                        className="text-sm text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[20px]"
                        onClick={() => startEditing(participant.id, "notes")}
                      >
                        {participant.notes || "-"}
                      </div>
                    )}
                  </TableCell>
                  
                  {/* Aksi */}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (editingField) {
                            stopEditing();
                          } else {
                            startEditing(participant.id, "fullName");
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="h-4 w-4" />
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