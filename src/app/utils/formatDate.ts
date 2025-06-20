import type { Language } from '@/atoms/language';

export function formatDate(date: string, includeRelative = false, language: Language = 'EN') {
  const currentDate = new Date(Date.now());

  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }

  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    return targetDate.toString();
  }

  // Calculate difference in years, months, days
  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  // Adjust for incomplete years/months
  if (
    currentDate.getMonth() < targetDate.getMonth() ||
    (currentDate.getMonth() === targetDate.getMonth() && currentDate.getDate() < targetDate.getDate())
  ) {
    yearsAgo--;
  }

  // Calculate months difference
  let totalMonthsAgo = (currentDate.getFullYear() - targetDate.getFullYear()) * 12 + (currentDate.getMonth() - targetDate.getMonth());
  if (currentDate.getDate() < targetDate.getDate()) {
    totalMonthsAgo--;
  }
  monthsAgo = totalMonthsAgo % 12;
  if (yearsAgo < 0) yearsAgo = 0;
  if (monthsAgo < 0) monthsAgo = 0;

  // Calculate days difference
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((currentDate.setHours(0,0,0,0) - targetDate.setHours(0,0,0,0)) / oneDay);

  let formattedDate = "";

  if (language === 'FR') {
    if (yearsAgo > 0) {
      formattedDate = `il y a ${yearsAgo} an${yearsAgo > 1 ? 's' : ''}`;
    } else if (monthsAgo > 0) {
      formattedDate = `il y a ${monthsAgo} mois`;
    } else if (diffDays > 0) {
      formattedDate = `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      formattedDate = "Aujourd'hui";
    }
  } else {
    if (yearsAgo > 0) {
      formattedDate = `${yearsAgo}y ago`;
    } else if (monthsAgo > 0) {
      formattedDate = `${monthsAgo}mo ago`;
    } else if (diffDays > 0) {
      formattedDate = `${diffDays}d ago`;
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
