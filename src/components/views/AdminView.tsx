import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Trash2, Users, FileText, Activity } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const AdminView: React.FC = () => {
  const { addToast } = useApp();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await api.getReports();
        setReports(res.reports);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleResolve = async (id: string, action: 'dismiss' | 'delete') => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    addToast(action === 'delete' ? 'Content removed from platform' : 'Report dismissed');
    try {
      await api.resolveReport(id, action);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Admin & Moderation Center
        </h2>
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
            <Users className="w-4 h-4 text-amber-500" />
            <span>TOTAL CREATORS</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">12,480</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>TOTAL POSTS</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">84,120</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
            <Activity className="w-4 h-4 text-amber-500" />
            <span>ACTIVE TODAY</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">3,910</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>PENDING REPORTS</span>
          </div>
          <span className="text-2xl font-black text-rose-500">{reports.length}</span>
        </div>
      </div>

      {/* Flagged Content Queue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Flagged Content Moderation Queue
        </h3>

        {isLoading ? (
          <div className="text-xs text-slate-400">Loading moderation queue...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No flagged items requiring review. Platform is clean!
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Report ID: {rep.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 font-mono text-[10px]">
                      {rep.reason}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Post Target: <strong className="text-slate-900 dark:text-white">{rep.postId}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolve(rep.id, 'dismiss')}
                  >
                    Dismiss Report
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleResolve(rep.id, 'delete')}
                  >
                    Delete Content
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
