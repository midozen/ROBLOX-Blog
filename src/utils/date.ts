export function formatDateWithOrdinal(
  date: Date,
  accurateDates: Boolean = false
): string {
  let day = date.getDate();
  let month = date.toLocaleString("default", { month: "long" });
  let year = date.getFullYear();

  if (accurateDates) {
    if (
      year < 2025 || (year === 2025 && (date.getMonth() < 2 ))
    ) {
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

interface MonthYear {
  year: string;
  month: string;
  formatted: string;
}

export function getMonthYears(
  startDate?: Date,
  accurateDates: Boolean = false
): Array<MonthYear> {
  const monthYears: Array<MonthYear> = [];

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
      if (
        year < 2025 ||
        (year === 2025 &&
          (current.getMonth() < 1 ||
            (current.getMonth() === 1 && current.getDate() < 28)))
      ) {
        formattedYear -= 14;
      } else {
        formattedYear -= 13;
      }
    }

    monthYears.push({
      year: year.toString(),
      month: month.toString().padStart(2, "0"),
      formatted: current
        .toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
        .replace(year.toString(), formattedYear.toString()),
    });

    // Create a new date to avoid mutation
    current.setMonth(current.getMonth() - 1);
  }

  return monthYears;
}

export function getAdjustedYear(date: Date, accurateDates: Boolean = false): number {
  if (!accurateDates) {
    return date.getFullYear();
  }

  const year = date.getFullYear(); 

  if (year < 2025 || (year === 2025 && (date.getMonth() < 1 || (date.getMonth() === 1 && date.getDate() < 28)))) {
    return year - 14;
  } else {
    return year - 13;
  }
}
