import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, X } from "lucide-react";

export default function SubmissionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions", { search: searchQuery }],
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.couponNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.whatsappNumber.includes(searchQuery) ||
      (submission.prizeName && submission.prizeName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "winner" && submission.isWinner) ||
      (statusFilter === "non-winner" && !submission.isWinner);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("id-ID");
  };

  if (isLoading) {
    return <div>Memuat riwayat pengajuan...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Riwayat Pengajuan</h2>
        <p className="text-gray-600 text-sm">Lihat semua pengajuan cek kupon dari pengguna</p>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama, nomor kupon, atau WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="winner">Pemenang</SelectItem>
            <SelectItem value="non-winner">Tidak Menang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Nomor Kupon</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Hasil</TableHead>
              <TableHead>Hadiah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchQuery || statusFilter !== "all" 
                    ? "Tidak ada hasil yang ditemukan" 
                    : "Belum ada pengajuan. Pengajuan akan muncul saat pengguna mengecek kupon."
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="text-sm">
                    {formatDate(submission.submittedAt!)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {submission.couponNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {submission.fullName}
                  </TableCell>
                  <TableCell className="text-sm">
                    {submission.whatsappNumber}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={submission.isWinner ? "default" : "secondary"}
                      className={submission.isWinner 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {submission.isWinner ? (
                        <>
                          <Trophy className="h-3 w-3 mr-1" />
                          Menang
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Tidak Menang
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {submission.prizeName || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-800">
            {submissions.length}
          </div>
          <div className="text-sm text-gray-600">Total Pengajuan</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {submissions.filter(s => s.isWinner).length}
          </div>
          <div className="text-sm text-gray-600">Pemenang</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">
            {submissions.filter(s => !s.isWinner).length}
          </div>
          <div className="text-sm text-gray-600">Tidak Menang</div>
        </div>
      </div>
    </div>
  );
}