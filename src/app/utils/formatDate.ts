import type { Language } from '@/atoms/language';

export function formatDate(date: string, includeRelative = false, language: Language = 'EN') {
  const currentDate = new Date();

  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }

  const targetDate = new Date(date);
  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (language === 'FR') {
    if (yearsAgo > 0) {
      formattedDate = `il y a ${yearsAgo} an${yearsAgo > 1 ? 's' : ''}`;
    } else if (monthsAgo > 0) {
      formattedDate = `il y a ${monthsAgo} mois`;
    } else if (daysAgo > 0) {
      formattedDate = `il y a ${daysAgo} jour${daysAgo > 1 ? 's' : ''}`;
    } else {
      formattedDate = "Aujourd'hui";
    }
  } else {
    if (yearsAgo > 0) {
      formattedDate = `${yearsAgo}y ago`;
    } else if (monthsAgo > 0) {
      formattedDate = `${monthsAgo}mo ago`;
    } else if (daysAgo > 0) {
      formattedDate = `${daysAgo}d ago`;
    } else {
      formattedDate = "Today";
    }
  }

  const locale = language === 'FR' ? 'fr-FR' : 'en-US';
  const fullDate = targetDate.toLocaleString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
