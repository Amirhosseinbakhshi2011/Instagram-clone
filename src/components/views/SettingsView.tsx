import React, { useState } from 'react';
import { Settings, Shield, Bell, Eye, Palette, Info, ExternalLink, Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const { addToast } = useApp();

  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const handleSaveSettings = async () => {
    await updateUser({ isPrivate });
    addToast('Settings updated successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-sm">
        {/* Theme Settings */}
        <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Palette className="w-4 h-4 text-amber-500" />
            <span>Appearance & Theme</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                theme === 'dark'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="block text-xs">Obsidian Dark</span>
                  <span className="block text-[10px] opacity-70">Deep luxury dark canvas</span>
                </div>
              </div>
              {theme === 'dark' && <Check className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                theme === 'light'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="block text-xs">Crystal Light</span>
                  <span className="block text-[10px] opacity-70">Crisp high-contrast canvas</span>
                </div>
              </div>
              {theme === 'light' && <Check className="w-4 h-4 text-amber-500" />}
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Eye className="w-4 h-4 text-amber-500" />
            <span>Privacy & Visibility</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                Private Account
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Only approved followers can view your posts and stories.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Notification Preferences</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Push Notifications</span>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Email Digests</span>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Creator & About Amira */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Info className="w-4 h-4 text-amber-500" />
            <span>About Amira Platform</span>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">AMIRA v2.0.0</span>
              <span className="font-mono text-[10px] text-slate-400">Next-Gen Architecture</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Designed & Built with passion by <strong>Amirhossein Bakhshi</strong>. Amira combines high-speed real-time social interaction with server-side Gemini AI content assistance.
            </p>
            <a
              href="https://github.com/Amirhosseinbakhshi2011"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-400 font-bold hover:underline pt-1"
            >
              <span>View GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="gold" onClick={handleSaveSettings}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
