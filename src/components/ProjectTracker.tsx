import React, { useState } from 'react';
import { 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  ExternalLink, 
  Calendar, 
  UserCheck, 
  Globe, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ClientProject } from '../types';

interface ProjectTrackerProps {
  projects: ClientProject[];
  selectedProjectId?: string;
}

export const ProjectTracker: React.FC<ProjectTrackerProps> = ({
  projects,
  selectedProjectId
}) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'in_progress': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      default: return 'text-slate-500 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <span>Pelacakan Progres Proyek (Project Progress Tracker)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau tahapan pengerjaan, milestone teknis, dan jadwal peluncuran aplikasi web Anda secara transparan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Selector List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
            Daftar Proyek Berjalan ({projects.length})
          </div>

          {projects.map(proj => {
            const isSelected = proj.id === activeProjectId;
            return (
              <button
                key={proj.id}
                onClick={() => setActiveProjectId(proj.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-950/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    {proj.institution}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-white">
                    {proj.progressPercent}%
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm mt-1">{proj.projectName}</h4>
                <div className="text-xs text-slate-400 mt-0.5">{proj.productName}</div>

                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Target: {proj.targetGoLive}
                  </span>
                  <span className="capitalize font-medium text-cyan-300">
                    {proj.currentPhase.replace('_', ' ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Project Detail View */}
        {activeProject && (
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  {activeProject.institution}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  {activeProject.projectName}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Klien PIC: <strong className="text-slate-200">{activeProject.clientName}</strong> · Lead Developer: <strong className="text-slate-200">{activeProject.leadDeveloper}</strong>
                </p>
              </div>

              {/* Progress summary circle/card */}
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Progres</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    {activeProject.progressPercent}%
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-400 flex items-center justify-center font-bold text-xs text-white">
                  ✓
                </div>
              </div>
            </div>

            {/* Quick Links: Staging URL & Custom Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Staging Preview Server</div>
                    <div className="text-xs font-mono text-cyan-300 font-semibold truncate max-w-[200px]">
                      {activeProject.stagingUrl || 'Sedang Dipersiapkan'}
                    </div>
                  </div>
                </div>
                {activeProject.stagingUrl && (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`Membuka staging environment: ${activeProject.stagingUrl}`); }}
                    className="p-1.5 hover:bg-slate-800 text-cyan-400 rounded-lg transition-colors"
                    title="Buka Staging Preview"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Target Peluncuran (Go-Live)</div>
                    <div className="text-xs font-mono text-white font-semibold">
                      {activeProject.targetGoLive}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                  Tepat Waktu
                </span>
              </div>
            </div>

            {/* Milestones Flow */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Tahapan Pengerjaan &amp; Milestone Terjadwal
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {activeProject.milestones.map((m, idx) => {
                  const isDone = m.status === 'completed';
                  const isInProgress = m.status === 'in_progress';

                  return (
                    <div key={m.id} className="relative group">
                      <div
                        className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 transition-transform ${
                          isDone ? 'bg-emerald-400' : isInProgress ? 'bg-cyan-400 ring-2 ring-cyan-500/30' : 'bg-slate-700'
                        }`}
                      />

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {idx + 1}. {m.title}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                              isDone ? 'bg-emerald-500/20 text-emerald-300' :
                              isInProgress ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {isDone ? 'Selesai' : isInProgress ? 'Sedang Dikerjakan' : 'Menunggu'}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-mono">
                            {m.completedDate ? `Selesai: ${m.completedDate}` : `Target: ${m.targetDate}`}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">{m.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Log */}
            <div className="pt-4 border-t border-slate-800">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Aktivitas &amp; Update Komitmen Terkini
              </h5>
              <div className="space-y-1.5">
                {activeProject.recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-[11px] font-mono text-slate-500">[{act.timestamp}]</span>
                    <span className="text-slate-300">{act.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
