import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Submission } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Search, CheckCircle, XCircle, Calendar, User, Phone, Hash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function SubmissionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  useEffect(() => {
    if (!submissions || submissions.length === 0) {
      setFilteredSubmissions([]);
      return;
    }
    
    const filtered = submissions.filter(submission => 
      submission.couponNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.whatsappNumber.includes(searchQuery) ||
      (submission.prizeName && submission.prizeName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredSubmissions(filtered);
  }, [submissions, searchQuery]);

  if (isLoading) {
    return <div>Memuat riwayat...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Riwayat Pengecekan Kupon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nomor kupon, nama, WhatsApp, atau hadiah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-submissions"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "Tidak ada hasil yang ditemukan" : "Belum ada riwayat pengecekan kupon"}
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="border-l-4" style={{
                borderLeftColor: submission.isWinner ? '#10b981' : '#6b7280'
              }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {submission.isWinner ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-500" />
                      )}
                      <Badge variant={submission.isWinner ? "default" : "secondary"}>
                        {submission.isWinner ? "MENANG" : "TIDAK MENANG"}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(submission.submittedAt!), { 
                        addSuffix: true,
                        locale: id 
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nomor Kupon</p>
                        <p className="font-mono font-medium">{submission.couponNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                        <p className="font-medium">{submission.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <p className="font-medium">{submission.whatsappNumber}</p>
                      </div>
                    </div>

                    {submission.isWinner && submission.prizeName && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">Hadiah</p>
                          <p className="font-medium text-green-600">{submission.prizeName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredSubmissions.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Menampilkan {filteredSubmissions.length} dari {submissions.length} total entri
          </div>
        )}
      </CardContent>
    </Card>
  );
}