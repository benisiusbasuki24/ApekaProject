import React, { useState } from 'react';
import { BookOpen, Search, Check, AlertCircle, ArrowRightLeft } from 'lucide-react';

interface BookItem {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  stock: number;
  available: number;
}

interface LoanItem {
  id: string;
  bookTitle: string;
  borrowerName: string;
  borrowDate: string;
  dueDate: string;
  daysLate: number;
  fineAmount: number; // Rp 1.000 / hari
  status: 'Dipinjam' | 'Terlambat';
}

export const LibraryDemo: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>([
    { id: '1', isbn: '978-602-03-8591-2', title: 'Laskar Pelangi', author: 'Andrea Hirata', category: 'Sastra & Fiksi', stock: 5, available: 3 },
    { id: '2', isbn: '978-979-3062-79-2', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', category: 'Sejarah & Sastra', stock: 4, available: 1 },
    { id: '3', isbn: '978-623-00-1123-4', title: 'Matematika Dasar Terapan', author: 'Prof. Suyatno', category: 'Sains & Teknologi', stock: 10, available: 7 },
    { id: '4', isbn: '978-602-424-694-5', title: 'Filosofi Teras', author: 'Henry Manampiring', category: 'Pengembangan Diri', stock: 6, available: 4 }
  ]);

  const [loans, setLoans] = useState<LoanItem[]>([
    { id: 'l1', bookTitle: 'Bumi Manusia', borrowerName: 'Dimas Prasetya (Kelas XI MIPA 2)', borrowDate: '2026-10-25', dueDate: '2026-11-01', daysLate: 10, fineAmount: 10000, status: 'Terlambat' },
    { id: 'l2', bookTitle: 'Laskar Pelangi', borrowerName: 'Rania Putri (Kelas X IPS 1)', borrowDate: '2026-11-05', dueDate: '2026-11-12', daysLate: 0, fineAmount: 0, status: 'Dipinjam' }
  ]);

  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [borrowerName, setBorrowerName] = useState('');

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || selectedBook.available <= 0 || !borrowerName) return;

    const newLoan: LoanItem = {
      id: Date.now().toString(),
      bookTitle: selectedBook.title,
      borrowerName: borrowerName,
      borrowDate: '2026-11-11',
      dueDate: '2026-11-18',
      daysLate: 0,
      fineAmount: 0,
      status: 'Dipinjam'
    };

    setLoans([newLoan, ...loans]);
    setBooks(books.map(b => b.id === selectedBook.id ? { ...b, available: b.available - 1 } : b));
    setSelectedBook(null);
    setBorrowerName('');
    alert('Peminjaman buku berhasil dicatat! Batas waktu pengembalian 7 hari.');
  };

  const handleReturn = (loanId: string, bookTitle: string) => {
    setLoans(loans.filter(l => l.id !== loanId));
    setBooks(books.map(b => b.title === bookTitle ? { ...b, available: b.available + 1 } : b));
    alert(`Buku "${bookTitle}" berhasil dikembalikan ke inventaris perpustakaan.`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-200">
      <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Sistem Manajemen Perpustakaan</h3>
              <span className="text-[11px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">
                Demo Langsung
              </span>
            </div>
            <p className="text-xs text-slate-400">Katalog ISBN · Sirkulasi Peminjaman · Kalkulator Denda Otomatis</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Katalog Koleksi Buku</h4>
            <span className="text-xs text-slate-400">Total Judul: {books.length}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {books.map(book => (
              <div key={book.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono">{book.isbn}</span>
                  <h5 className="font-bold text-white text-sm mt-0.5">{book.title}</h5>
                  <p className="text-xs text-slate-400">Karya {book.author}</p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Tersedia: <strong className={book.available > 0 ? "text-emerald-400" : "text-rose-400"}>{book.available}</strong>/{book.stock}
                  </span>
                  <button
                    disabled={book.available <= 0}
                    onClick={() => setSelectedBook(book)}
                    className="px-2.5 py-1 text-xs rounded bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium transition-colors"
                  >
                    Pinjam
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Loan Active Table */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mt-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Sirkulasi Peminjaman Aktif</h4>
            <div className="space-y-2">
              {loans.map(loan => (
                <div key={loan.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div>
                    <span className="font-bold text-white">{loan.bookTitle}</span>
                    <div className="text-slate-400 text-[11px]">{loan.borrowerName} · Jatuh tempo: {loan.dueDate}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {loan.daysLate > 0 ? (
                      <span className="text-amber-400 font-semibold text-[11px]">
                        Terlambat {loan.daysLate} hari (Denda: Rp {loan.fineAmount.toLocaleString('id-ID')})
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-[11px]">Masa Pinjam Aktif</span>
                    )}
                    <button
                      onClick={() => handleReturn(loan.id, loan.bookTitle)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium text-[11px]"
                    >
                      Kembalikan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Borrow Form */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 h-fit">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Form Peminjaman Siswa</h4>
          {selectedBook ? (
            <form onSubmit={handleBorrow} className="space-y-3">
              <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                <span className="text-[10px] text-violet-300">Buku Dipilih</span>
                <div className="font-bold text-white text-sm">{selectedBook.title}</div>
                <div className="text-xs text-slate-400">ISBN: {selectedBook.isbn}</div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Peminjam &amp; Kelas</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Ahmad Zaky (Kelas XII IPA 1)"
                  value={borrowerName}
                  onChange={e => setBorrowerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 py-1">
                <div>Durasi Pinjam: <strong>7 Hari Kalender</strong></div>
                <div>Tarif Denda Keterlambatan: <strong>Rp 1.000 / Hari</strong></div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs font-bold text-white"
                >
                  Simpan Pinjam
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              Pilih salah satu buku dari katalog di sebelah kiri untuk mencatat peminjaman.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
