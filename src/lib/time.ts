import { format } from 'date-fns';

const LOCK_OFFSET_MS = 2 * 60 * 60 * 1000;

export function isLocked(kickoffIso: string, now: Date = new Date()): boolean {
  const cutoff = new Date(kickoffIso).getTime() - LOCK_OFFSET_MS;
  return now.getTime() >= cutoff;
}

const SWE_DAY = ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'];
const SWE_MONTH = ['jan', 'feb', 'mars', 'apr', 'maj', 'juni', 'juli', 'aug', 'sep', 'okt', 'nov', 'dec'];

export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  const day = SWE_DAY[d.getDay()];
  const month = SWE_MONTH[d.getMonth()];
  return `${day} ${d.getDate()} ${month}, ${format(d, 'HH:mm')}`;
}

export function formatDateHeader(iso: string): string {
  const d = new Date(iso);
  const day = SWE_DAY[d.getDay()];
  const month = SWE_MONTH[d.getMonth()];
  return `${day} ${d.getDate()} ${month}`;
}

export function dateKey(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd');
}
