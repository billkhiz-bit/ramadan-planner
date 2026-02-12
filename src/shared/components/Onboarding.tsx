import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Coins, Loader2 } from 'lucide-react';
import { useStore } from '../../store';
import { Button } from './Button';
import { CrescentIcon } from './CrescentIcon';
import { fetchRamadanPrayerTimes } from '../utils/api';
import { getMethodForCountry, CALC_METHODS } from '../utils/calculationMethod';
import type { CalculationMethod } from '../types';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SAR', 'AED', 'PKR', 'INR', 'MYR', 'IDR', 'TRY', 'EGP', 'BDT', 'NGN'];

type Step = 'welcome' | 'name' | 'location' | 'dates' | 'currency' | 'ready';
const STEPS: Step[] = ['welcome', 'name', 'location', 'dates', 'currency', 'ready'];

export function Onboarding() {
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const setPrayerTimesCache = useStore((s) => s.setPrayerTimesCache);
  const setPrayerTimesFetchError = useStore((s) => s.setPrayerTimesFetchError);

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [method, setMethod] = useState<CalculationMethod>(15);
  const [startDate, setStartDate] = useState('2026-02-17');
  const [days, setDays] = useState<29 | 30>(30);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  function goNext() {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }

  async function handleFinish() {
    setLoading(true);
    const settings = {
      name: name.trim() || 'Friend',
      city: city.trim(),
      country: country.trim(),
      calculationMethod: method,
      ramadanStartDate: startDate,
      ramadanDays: days,
      currency,
    };

    // Try to fetch prayer times
    if (settings.city && settings.country) {
      try {
        const times = await fetchRamadanPrayerTimes(
          settings.city, settings.country, settings.calculationMethod, settings.ramadanStartDate, settings.ramadanDays
        );
        setPrayerTimesCache(times);
        setPrayerTimesFetchError(null);
      } catch {
        setPrayerTimesFetchError('Could not fetch prayer times. You can retry in Settings.');
      }
    }

    completeOnboarding(settings);
    setLoading(false);
  }

  return (
    <div className="min-h-dvh bg-cream-50 dark:bg-surface-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= stepIndex ? 'bg-teal-600 dark:bg-gold-400' : 'bg-cream-300 dark:bg-surface-700'
              }`}
            />
          ))}
        </div>

        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div className="step-fade-in text-center space-y-6">
            <CrescentIcon size={56} className="text-gold-400 mx-auto" glow />
            <div>
              <h1 className="text-2xl font-bold text-teal-900 dark:text-cream-100">Ramadan Planner</h1>
              <p className="text-sm text-teal-700 dark:text-cream-300 mt-2">
                Track your worship, Quran reading, and spiritual growth throughout the blessed month.
              </p>
            </div>
            <Button onClick={goNext} className="w-full">
              Get Started
            </Button>
          </div>
        )}

        {/* Step: Name */}
        {step === 'name' && (
          <div className="step-fade-in space-y-4">
            <h2 className="text-xl font-bold text-teal-900 dark:text-cream-100">What's your name?</h2>
            <p className="text-sm text-teal-700 dark:text-cream-300">We'll use this to personalize your experience.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              placeholder="Your name"
              className="w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2.5 text-teal-900 dark:text-cream-100 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600"
              autoFocus
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={goBack} className="flex-1">
                <ChevronLeft size={16} className="inline -ml-1" /> Back
              </Button>
              <Button onClick={goNext} className="flex-1">
                Next <ChevronRight size={16} className="inline -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Location */}
        {step === 'location' && (
          <div className="step-fade-in space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-teal-600 dark:text-gold-400" />
              <h2 className="text-xl font-bold text-teal-900 dark:text-cream-100">Your Location</h2>
            </div>
            <p className="text-sm text-teal-700 dark:text-cream-300">Used to fetch accurate prayer times.</p>
            <div className="space-y-3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g., London)"
                className="w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2.5 text-teal-900 dark:text-cream-100 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600"
                autoFocus
              />
              <input
                type="text"
                value={country}
                onChange={(e) => {
                  const val = e.target.value;
                  setCountry(val);
                  setMethod(getMethodForCountry(val));
                }}
                placeholder="Country (e.g., United Kingdom)"
                className="w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2.5 text-teal-900 dark:text-cream-100 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600"
              />
              <div>
                <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Calculation Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(Number(e.target.value) as CalculationMethod)}
                  className="w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2.5 text-teal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600"
                >
                  {CALC_METHODS.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={goBack} className="flex-1">
                <ChevronLeft size={16} className="inline -ml-1" /> Back
              </Button>
              <Button onClick={goNext} className="flex-1" disabled={!city.trim() || !country.trim()}>
                Next <ChevronRight size={16} className="inline -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Dates */}
        {step === 'dates' && (
          <div className="step-fade-in space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-teal-600 dark:text-gold-400" />
              <h2 className="text-xl font-bold text-teal-900 dark:text-cream-100">Ramadan Dates</h2>
            </div>
            <p className="text-sm text-teal-700 dark:text-cream-300">Confirm the start date and duration for your location.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2.5 text-teal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-teal-700 dark:text-cream-300 mb-1">Duration</label>
                <div className="flex gap-2">
                  {([29, 30] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                        days === d
                          ? 'border-teal-600 bg-teal-50 text-teal-700 dark:border-gold-400 dark:bg-gold-400/10 dark:text-gold-300'
                          : 'border-cream-200 dark:border-surface-700 text-teal-700 dark:text-cream-300 hover:border-cream-400'
                      }`}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={goBack} className="flex-1">
                <ChevronLeft size={16} className="inline -ml-1" /> Back
              </Button>
              <Button onClick={goNext} className="flex-1">
                Next <ChevronRight size={16} className="inline -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Currency */}
        {step === 'currency' && (
          <div className="step-fade-in space-y-4">
            <div className="flex items-center gap-2">
              <Coins size={20} className="text-teal-600 dark:text-gold-400" />
              <h2 className="text-xl font-bold text-teal-900 dark:text-cream-100">Charity Currency</h2>
            </div>
            <p className="text-sm text-teal-700 dark:text-cream-300">Choose the currency for tracking your charitable giving.</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-sm bg-white dark:bg-surface-800 border border-cream-200 dark:border-surface-700 rounded-lg px-3 py-2.5 text-teal-900 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-600"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={goBack} className="flex-1">
                <ChevronLeft size={16} className="inline -ml-1" /> Back
              </Button>
              <Button onClick={goNext} className="flex-1">
                Next <ChevronRight size={16} className="inline -mr-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Ready */}
        {step === 'ready' && (
          <div className="step-fade-in text-center space-y-6">
            <CrescentIcon size={48} className="text-gold-400 mx-auto" glow />
            <div>
              <h2 className="text-2xl font-bold text-teal-900 dark:text-cream-100">بسم الله</h2>
              <p className="text-lg text-teal-700 dark:text-cream-300 mt-1">Bismillah</p>
              <p className="text-sm text-teal-600 dark:text-cream-400 mt-3">
                You're all set, {name.trim() || 'Friend'}! May this Ramadan bring you closer to Allah.
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={handleFinish} className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Fetching prayer times...
                  </span>
                ) : (
                  'Begin My Ramadan Journey'
                )}
              </Button>
              <Button variant="secondary" onClick={goBack} className="w-full">
                <ChevronLeft size={16} className="inline -ml-1" /> Go Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
