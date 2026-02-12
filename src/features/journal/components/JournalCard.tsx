import { useState, useRef, useEffect, useCallback } from 'react';
import { PenLine, Check, Loader2 } from 'lucide-react';
import { useStore } from '../../../store';
import { Card } from '../../../shared/components/Card';
import type { DateKey } from '../../../shared/types';

interface JournalCardProps {
  dateKey: DateKey;
}

export function JournalCard({ dateKey }: JournalCardProps) {
  const journal = useStore((s) => s.journals[dateKey]);
  const updateJournal = useStore((s) => s.updateJournal);

  const [value, setValue] = useState(journal?.content ?? '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external changes
  useEffect(() => { setValue(journal?.content ?? ''); }, [journal?.content]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleChange = useCallback((newValue: string) => {
    const trimmed = newValue.slice(0, 2000);
    setValue(trimmed);
    setSaveStatus('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    debounceRef.current = setTimeout(() => {
      updateJournal(dateKey, trimmed);
      setSaveStatus('saved');
      savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  }, [updateJournal, dateKey]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <PenLine size={16} className="text-gold-500" />
        <h2 className="text-sm font-semibold text-teal-900 dark:text-cream-100">Daily Reflection</h2>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="What are you grateful for today? What did you learn?"
        className="w-full text-sm bg-cream-100 dark:bg-surface-700 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2.5 text-teal-800 dark:text-cream-200 placeholder:text-cream-400 dark:placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600 resize-none min-h-[80px]"
        rows={3}
      />

      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-cream-400 dark:text-cream-500">{value.length}/2000</span>
        {saveStatus === 'saving' && (
          <span className="flex items-center gap-1 text-[10px] text-teal-500">
            <Loader2 size={10} className="animate-spin" />
            Saving...
          </span>
        )}
        {saveStatus === 'saved' && (
          <span className="flex items-center gap-1 text-[10px] text-sage-500">
            <Check size={10} />
            Saved
          </span>
        )}
      </div>
    </Card>
  );
}
