import { DEFAULT_LOCALE } from '../constants/i18n';

export default function formatDate(date: Date) {
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
