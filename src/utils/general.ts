import type { Post } from "./types";

export function formatDate(date: Date, accurateDates: Boolean = false): string {
  let day = date.getDate();
  let month = date.toLocaleString("default", { month: "long" });
  let year = date.getFullYear();

  if (accurateDates) {
    if (year < 2025 || (year === 2025 && (date.getMonth() < 1 || (date.getMonth() === 1 && day < 28)))) {
      year -= 14;
    } else {
      year -= 13;
    }
  }

  let daySuffix = "th";
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = "st";
  } else if (day === 2 || day === 22) {
    daySuffix = "nd";
  } else if (day === 3 || day === 23) {
    daySuffix = "rd";
  }

  return `${month} ${day}${daySuffix}, ${year}`;
}

export function formatWebsiteDomain(domain: string) {
  const parts = domain.split(".");

  return parts[0].toUpperCase() + "." + parts[1];
}

export function generateMonthYears(startDate?: Date, accurateDates: Boolean = false): Array<{ num: string; formatted: string; }> {
  const monthYears: Array<{ num: string; formatted: string; }> = [];

  const start = new Date(startDate ?? new Date());
  const current = new Date();

  start.setDate(1);
  current.setDate(1);

  while (
    current.getFullYear() > start.getFullYear() ||
    (current.getFullYear() === start.getFullYear() &&
      current.getMonth() >= start.getMonth())
  ) {
    let year = current.getFullYear();
    const month = current.getMonth() + 1;

    let formattedYear = year;
    if (accurateDates) {
      if (year < 2025 || (year === 2025 && (current.getMonth() < 1 || (current.getMonth() === 1 && current.getDate() < 28)))) {
        formattedYear -= 14;
      } else {
        formattedYear -= 13;
      }
    }

    monthYears.push({
      num: `${year}${month.toString().padStart(2, "0")}`,
      formatted: current.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }).replace(year.toString(), formattedYear.toString()),
    });

    // Create a new date to avoid mutation
    current.setMonth(current.getMonth() - 1);
  }

  return monthYears;
}

export function getPostLink(post: any, accurateDates: Boolean = false) {
  let day = post.dateCreated.getDate();
  let month = post.dateCreated.getMonth()
  let year = post.dateCreated.getFullYear();

  if (accurateDates) {
    if (year < 2025 || (year === 2025 && (month < 1 || (month === 1 && day < 28)))) {
      year -= 14;
    } else {
      year -= 13;
    }
  }

  return `/${year}/${(month + 1).toString().padStart(2, "0")}/${post.slug}`;
}