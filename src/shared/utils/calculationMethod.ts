import type { CalculationMethod } from '../types';

/**
 * Maps countries to their locally preferred prayer time calculation method.
 * Based on what local mosques and Islamic organizations commonly use.
 *
 * Aladhan API methods:
 *  1  = University of Islamic Sciences, Karachi
 *  2  = ISNA (Islamic Society of North America)
 *  3  = Muslim World League (MWL)
 *  4  = Umm Al-Qura University, Makkah
 *  5  = Egyptian General Authority of Survey
 *  7  = Institute of Geophysics, University of Tehran
 *  8  = Gulf Region
 *  9  = Kuwait
 * 10  = Qatar
 * 11  = Majlis Ugama Islam Singapura (MUIS)
 * 12  = Union Organization Islamic de France (UOIF)
 * 13  = Diyanet İşleri Başkanlığı (Turkey)
 * 14  = Spiritual Administration of Muslims of Russia
 * 15  = Moonsighting Committee Worldwide
 */

const COUNTRY_METHOD_MAP: Record<string, CalculationMethod> = {
  // North America → ISNA
  'united states': 2,
  'usa': 2,
  'us': 2,
  'canada': 2,
  'mexico': 2,

  // UK & Ireland → Moonsighting Committee
  'united kingdom': 15,
  'uk': 15,
  'england': 15,
  'scotland': 15,
  'wales': 15,
  'northern ireland': 15,
  'ireland': 15,

  // Saudi Arabia & nearby → Umm Al-Qura
  'saudi arabia': 4,
  'ksa': 4,
  'yemen': 4,

  // Gulf states → Gulf Region
  'uae': 8,
  'united arab emirates': 8,
  'bahrain': 8,
  'oman': 8,

  // Kuwait
  'kuwait': 9,

  // Qatar
  'qatar': 10,

  // Egypt & North Africa → Egyptian General Authority
  'egypt': 5,
  'libya': 5,
  'sudan': 5,
  'south sudan': 5,

  // Maghreb → MWL (closest standard)
  'morocco': 3,
  'algeria': 3,
  'tunisia': 3,

  // South Asia → Karachi
  'pakistan': 1,
  'india': 1,
  'bangladesh': 1,
  'afghanistan': 1,
  'sri lanka': 1,
  'nepal': 1,
  'maldives': 1,

  // Southeast Asia → MUIS (Singapore)
  'singapore': 11,
  'malaysia': 11,
  'indonesia': 11,
  'brunei': 11,
  'thailand': 11,
  'philippines': 11,
  'myanmar': 11,
  'cambodia': 11,

  // Turkey → Diyanet
  'turkey': 13,
  'turkiye': 13,
  'türkiye': 13,

  // Iran → Tehran
  'iran': 7,

  // France → UOIF
  'france': 12,

  // Russia & Central Asia → Russian method
  'russia': 14,
  'kazakhstan': 14,
  'uzbekistan': 14,
  'tajikistan': 14,
  'kyrgyzstan': 14,
  'turkmenistan': 14,
  'azerbaijan': 14,

  // Europe (non-UK/France) → MWL
  'germany': 3,
  'netherlands': 3,
  'belgium': 3,
  'spain': 3,
  'italy': 3,
  'sweden': 3,
  'norway': 3,
  'denmark': 3,
  'finland': 3,
  'switzerland': 3,
  'austria': 3,
  'greece': 3,
  'portugal': 3,
  'poland': 3,
  'romania': 3,
  'hungary': 3,
  'czech republic': 3,
  'bosnia': 3,
  'bosnia and herzegovina': 3,
  'albania': 3,
  'kosovo': 3,
  'north macedonia': 3,
  'croatia': 3,
  'serbia': 3,
  'bulgaria': 3,

  // Iraq, Jordan, Palestine, Lebanon, Syria → MWL
  'iraq': 3,
  'jordan': 3,
  'palestine': 3,
  'lebanon': 3,
  'syria': 3,

  // Africa (Sub-Saharan) → Egyptian or MWL
  'nigeria': 5,
  'somalia': 5,
  'kenya': 5,
  'ethiopia': 5,
  'tanzania': 5,
  'south africa': 3,
  'ghana': 5,
  'senegal': 3,
  'mali': 3,
  'niger': 3,
  'chad': 5,

  // Australia & NZ → ISNA (commonly used there)
  'australia': 2,
  'new zealand': 2,

  // China → MWL
  'china': 3,
  'japan': 3,
  'south korea': 3,
};

/**
 * Returns the recommended calculation method for a given country.
 * Falls back to MWL (3) as the most internationally recognized standard.
 */
export function getMethodForCountry(country: string): CalculationMethod {
  const normalized = country.trim().toLowerCase();
  return COUNTRY_METHOD_MAP[normalized] ?? 3;
}

/** Label lookup for displaying the method name */
export const CALC_METHODS: { id: CalculationMethod; label: string }[] = [
  { id: 15, label: 'Moonsighting Committee Worldwide' },
  { id: 2, label: 'ISNA (North America)' },
  { id: 3, label: 'Muslim World League' },
  { id: 1, label: 'University of Islamic Sciences, Karachi' },
  { id: 4, label: 'Umm Al-Qura University, Makkah' },
  { id: 5, label: 'Egyptian General Authority' },
  { id: 7, label: 'Institute of Geophysics, Tehran' },
  { id: 8, label: 'Gulf Region' },
  { id: 9, label: 'Ministry of Awqaf, Kuwait' },
  { id: 10, label: 'Qatar' },
  { id: 11, label: 'Majlis Ugama Islam Singapura' },
  { id: 12, label: 'UOIF (France)' },
  { id: 13, label: 'Diyanet (Turkey)' },
  { id: 14, label: 'Spiritual Administration of Muslims, Russia' },
];

export function getMethodLabel(id: CalculationMethod): string {
  return CALC_METHODS.find((m) => m.id === id)?.label ?? 'Unknown';
}
