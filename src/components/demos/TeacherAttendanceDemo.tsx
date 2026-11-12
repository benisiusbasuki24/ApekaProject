import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle, AlertCircle, FileText, UserCheck, ShieldCheck } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  timeIn: string;
  timeOut?: string;
  status: 'Tepat Waktu' | 'Terlambat' | 'Izin' | 'Sakit';
  locationAccuracy: string;
}

export const TeacherAttendanceDemo: React.FC = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('07:15:24 WIB');
  const [inSchoolZone, setInSchoolZone] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: '1', name: 'Drs. Supardi, M.Pd.', role: 'Guru Matematika', timeIn: '06:45:10', status: 'Tepat Waktu', locationAccuracy: 'Radius 25m (Valid)' },
    { id: '2', name: 'Siti Aminah, S.Pd.', role: 'Guru Bahasa Inggris', timeIn: '06:58:30', status: 'Tepat Waktu', locationAccuracy: 'Radius 18m (Valid)' },
    { id: '3', name: 'Ahmad Fauzi, S.T.', role: 'Guru Komputer & IT', timeIn: '07:12:05', status: 'Terlambat', locationAccuracy: 'Radius 30m (Valid)' },
    { id: '4', name: 'Sri Wahyuni, M.Si.', role: 'Guru Fisika', timeIn: '-', status: 'Izin', locationAccuracy: 'Surat Dinas Terlampir' }
  ]);

  const handleClockIn = () => {
    if (!inSchoolZone) {
      alert('Peringatan Geofencing: Anda terdeteksi di luar zona sekolah (radius maksimal 150 meter). Absensi ditolak!');
      return;
    }
    setClockedIn(true);
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      name: 'Budi Santoso, S.Pd. (Anda)',
      role: 'Guru Biologi',
      timeIn: new Date().toLocaleTimeString('id-ID'),
      status: 'Tepat Waktu',
      locationAccuracy: 'Radius 12m (GPS Akurat)'
    };
    setRecords([newRecord, ...records]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-200">
      <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Presensi Guru &amp; Pegawai</h3>
              <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Demo Langsung
              </span>
            </div>
            <p className="text-xs text-slate-400">GPS Geofencing Tervalidasi · Anti-Titip Absen · Rekap Otomatis</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clock In Panel */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Status Kehadiran Anda</span>
              <span className="font-mono text-cyan-400">{currentTime}</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center my-4">
              <div className="text-xs text-slate-400">Titik Geofencing Sekolah</div>
              <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>SMA Negeri 1 (-6.2088, 106.8456)</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Akurasi GPS: 8 meter di dalam batas radius</div>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-y border-slate-800">
              <span className="text-slate-400">Simulasi Di Luar Radius:</span>
              <button
                onClick={() => setInSchoolZone(!inSchoolZone)}
                className={`px-2 py-1 text-[11px] font-semibold rounded ${
                  inSchoolZone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {inSchoolZone ? 'Di Dalam Sekolah' : 'Di Luar Radius (Mock)'}
              </button>
            </div>
          </div>

          <div className="pt-4">
            {clockedIn ? (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-center">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-emerald-300">Absensi Berhasil Dicatat!</div>
                <div className="text-[11px] text-emerald-400/80 mt-0.5">Waktu: {records[0]?.timeIn} WIB</div>
              </div>
            ) : (
              <button
                onClick={handleClockIn}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>Tekan untuk Presensi Hadir</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Attendance Table */}
        <div className="md:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Log Kehadiran Hari Ini (Live)</h4>
            <span className="text-xs text-slate-400 font-mono">Total Hadir: {records.filter(r => r.timeIn !== '-').length}/42</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Nama Guru</th>
                  <th className="py-2.5 px-3">Mata Pelajaran</th>
                  <th className="py-2.5 px-3">Waktu Masuk</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Verifikasi GPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {records.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-medium text-white">{rec.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{rec.role}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">{rec.timeIn}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        rec.status === 'Tepat Waktu' ? 'bg-emerald-500/20 text-emerald-300' :
                        rec.status === 'Terlambat' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">{rec.locationAccuracy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
