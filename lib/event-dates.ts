const DATE_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})/;
const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Store calendar dates at noon UTC so YYYY-MM-DD comparisons stay correct across time zones. */
export function parseEventDateInput(value: string | Date): Date {
  if (value instanceof Date) return value;
  const dateOnly = value.match(DATE_ONLY_RE);
  if (dateOnly) {
    return new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T12:00:00.000Z`);
  }
  return new Date(value);
}

/** Calendar day as YYYY-MM-DD. Date-only strings are taken literally (no UTC parsing). */
export function toLocalDateKey(value: string | Date): string {
  if (typeof value === 'string') {
    const match = value.match(DATE_KEY_RE);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }

  const date = typeof value === 'string' ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayLocalDateKey(): string {
  return toLocalDateKey(new Date());
}

/** 
 * True when the event date is today or later (by calendar day, not clock time).
 * For multi-day events with an endDate, the event remains upcoming/active until endDate has passed.
 */
export function isUpcomingEvent(startDate: string | Date, endDate?: string | Date | null): boolean {
  if (endDate) {
    try {
      const endKey = toLocalDateKey(endDate);
      if (endKey && !isNaN(new Date(endDate).getTime())) {
        return endKey >= todayLocalDateKey();
      }
    } catch {
      // fallback to startDate
    }
  }
  return toLocalDateKey(startDate) >= todayLocalDateKey();
}

export function isPastEvent(startDate: string | Date, endDate?: string | Date | null): boolean {
  return !isUpcomingEvent(startDate, endDate);
}

/**
 * Format date or date range in a clean, human-readable format.
 * Examples:
 * - Single date: "Oct 10, 2026"
 * - Same month: "Oct 10 – 12, 2026"
 * - Different months (same year): "Oct 30 – Nov 2, 2026"
 * - Different years: "Dec 30, 2026 – Jan 2, 2027"
 */
export function formatEventDateRange(
  startDateInput: string | Date | undefined | null,
  endDateInput?: string | Date | null
): string {
  if (!startDateInput) return '';

  const start = typeof startDateInput === 'string' && DATE_ONLY_RE.test(startDateInput)
    ? parseEventDateInput(startDateInput)
    : new Date(startDateInput);

  if (isNaN(start.getTime())) return String(startDateInput);

  if (!endDateInput) {
    return start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const end = typeof endDateInput === 'string' && DATE_ONLY_RE.test(endDateInput)
    ? parseEventDateInput(endDateInput)
    : new Date(endDateInput);

  if (isNaN(end.getTime())) {
    return start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const startKey = toLocalDateKey(start);
  const endKey = toLocalDateKey(end);

  // If start and end are the same day, display single date
  if (startKey === endKey) {
    return start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // If start is after end, fallback to start
  if (startKey > endKey) {
    return start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();

  // Same month and year: "Oct 10 – 12, 2026"
  if (startYear === endYear && startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
  }

  // Different month, same year: "Oct 30 – Nov 2, 2026"
  if (startYear === endYear) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  }

  // Different years: "Dec 30, 2026 – Jan 2, 2027"
  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
}
