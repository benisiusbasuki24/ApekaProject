import React, { useState } from 'react';
import { Package, Search, Plus, MapPin, Tag } from 'lucide-react';

export const InventoryDemo: React.FC = () => {
  const [items, setItems] = useState([
    { id: 'BMN-001', name: 'Proyektor Epson EB-X500', room: 'Laboratorium Komputer 1', condition: 'Baik', count: 1, date: '2024-02-10' },
    { id: 'BMN-002', name: 'AC Daikin 2 PK Inverter', room: 'Ruang Guru & Kepala Sekolah', condition: 'Baik', count: 2, date: '2023-08-15' },
    { id: 'BMN-003', name: 'Meja Komputer Siswa Informa', room: 'Laboratorium Komputer 2', condition: 'Rusak Ringan', count: 4, date: '2022-11-20' },
    { id: 'BMN-004', name: 'Sound System Wireless Portable', room: 'Aula Serbaguna Gedung B', condition: 'Baik', count: 1, date: '2024-05-12' }
  ]);

  const [search, setSearch] = useState('');

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.room.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-200">
      <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Inventarisasi Kantor &amp; Sarana Sekolah</h3>
              <span className="text-[11px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full">
                Demo Langsung
              </span>
            </div>
            <p className="text-xs text-slate-400">Pencatatan Aset BMN · Pemetaan Ruangan · Monitoring Kondisi Fisik</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama barang, ruang, atau kode BMN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Total Item: <strong className="text-white">{items.length} Barang</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Kode Register BMN</th>
                <th className="py-3 px-4">Nama Sarana / Prasarana</th>
                <th className="py-3 px-4">Penempatan Ruangan</th>
                <th className="py-3 px-4">Jumlah Unit</th>
                <th className="py-3 px-4">Kondisi Fisik</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">{item.id}</td>
                  <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                  <td className="py-3 px-4 text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.room}</span>
                  </td>
                  <td className="py-3 px-4 tabular-nums text-slate-200">{item.count} Unit</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.condition === 'Baik' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
