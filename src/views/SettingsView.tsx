import { useState, useRef } from 'react';
import { Settings, MapPin, Calendar, Moon, Sun, Download, Upload, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../shared/components/Card';
import { Button } from '../shared/components/Button';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';
import { fetchRamadanPrayerTimes } from '../shared/utils/api';
import { getMethodForCountry, CALC_METHODS } from '../shared/utils/calculationMethod';
import type { CalculationMethod } from '../shared/types';

export function SettingsView() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const resetAll = useStore((s) => s.resetAll);
  const setPrayerTimesCache = useStore((s) => s.setPrayerTimesCache);
  const setPrayerTimesFetchError = useStore((s) => s.setPrayerTimesFetchError);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [refetching, setRefetching] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ramadan-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result as string);
      setImportStatus(ok ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function handleRefetchPrayerTimes() {
    setRefetching(true);
    try {
      const times = await fetchRamadanPrayerTimes(
        settings.city, settings.country, settings.calculationMethod,
        settings.ramadanStartDate, settings.ramadanDays,
      );
      setPrayerTimesCache(times);
      setPrayerTimesFetchError(null);
    } catch {
      setPrayerTimesFetchError('Failed to fetch prayer times. Check your internet connection.');
    }
    setRefetching(false);
  }

  const inputCls = "w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2 text-teal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-teal-400";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings size={20} className="text-teal-600 dark:text-gold-400" />
        <h1 className="text-lg font-bold text-teal-900 dark:text-cream-100">Settings</h1>
      </div>

      {/* Appearance */}
      <Card>
        <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100 mb-3">Appearance</h2>
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between py-2"
        >
          <div className="flex items-center gap-2">
            {darkMode ? <Moon size={16} className="text-gold-400" /> : <Sun size={16} className="text-gold-500" />}
            <span className="text-sm text-teal-800 dark:text-cream-200">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-10 h-6 rounded-full transition-colors ${darkMode ? 'bg-teal-600' : 'bg-cream-300'} relative`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
        </button>
      </Card>

      {/* Profile */}
      <Card>
        <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100 mb-3">Profile</h2>
        <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Name</label>
        <input
          type="text"
          value={settings.name}
          onChange={(e) => updateSettings({ name: e.target.value.slice(0, 30) })}
          className={inputCls}
        />
      </Card>

      {/* Location & Prayer Times */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-teal-500" />
          <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Location & Prayer Times</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">City</label>
            <input type="text" value={settings.city} onChange={(e) => updateSettings({ city: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Country</label>
            <input type="text" value={settings.country} onChange={(e) => {
              const val = e.target.value;
              updateSettings({ country: val, calculationMethod: getMethodForCountry(val) });
            }} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Calculation Method</label>
            <select
              value={settings.calculationMethod}
              onChange={(e) => updateSettings({ calculationMethod: Number(e.target.value) as CalculationMethod })}
              className={inputCls}
            >
              {CALC_METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={handleRefetchPrayerTimes} disabled={refetching || !settings.city || !settings.country}>
            {refetching ? <Loader2 size={14} className="animate-spin inline mr-1" /> : <RefreshCw size={14} className="inline mr-1" />}
            Refetch Prayer Times
          </Button>
        </div>
      </Card>

      {/* Ramadan Dates */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-teal-500" />
          <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Ramadan Dates</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Start Date</label>
            <input
              type="date"
              value={settings.ramadanStartDate}
              onChange={(e) => updateSettings({ ramadanStartDate: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Duration</label>
            <div className="flex gap-2">
              {([29, 30] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => updateSettings({ ramadanDays: d })}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                    settings.ramadanDays === d
                      ? 'border-teal-600 bg-teal-50 text-teal-700 dark:border-gold-400 dark:bg-gold-400/10 dark:text-gold-300'
                      : 'border-cream-200 dark:border-surface-700 text-teal-700 dark:text-cream-300'
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Data */}
      <Card>
        <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100 mb-3">Data</h2>
        <div className="space-y-2">
          <Button variant="secondary" size="sm" onClick={handleExport} className="w-full flex items-center justify-center gap-2">
            <Download size={14} /> Export Data
          </Button>
          <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2">
            <Upload size={14} /> Import Data
          </Button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          {importStatus === 'success' && <p className="text-xs text-sage-500 text-center">Import successful!</p>}
          {importStatus === 'error' && <p className="text-xs text-warm-red-500 text-center">Import failed. Invalid file.</p>}
          <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)} className="w-full flex items-center justify-center gap-2">
            <Trash2 size={14} /> Reset All Data
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={showResetConfirm}
        title="Reset All Data"
        description="This will permanently delete all your Ramadan data. This cannot be undone."
        confirmLabel="Reset Everything"
        variant="danger"
        onConfirm={resetAll}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
