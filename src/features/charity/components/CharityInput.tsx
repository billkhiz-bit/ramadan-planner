import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../../../store';
import type { DateKey } from '../../../shared/types';

interface CharityInputProps {
  dateKey: DateKey;
}

export function CharityInput({ dateKey }: CharityInputProps) {
  const addCharity = useStore((s) => s.addCharity);
  const currency = useStore((s) => s.settings.currency);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  function handleAdd() {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    addCharity(num, note.trim(), dateKey);
    setAmount('');
    setNote('');
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-shrink-0 w-24">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-teal-600 dark:text-cream-400">{currency}</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg pl-10 pr-2 py-2 text-teal-900 dark:text-cream-100 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 100))}
          placeholder="Note (optional)"
          className="flex-1 text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2 text-teal-900 dark:text-cream-100 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
      <button
        onClick={handleAdd}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-30 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
