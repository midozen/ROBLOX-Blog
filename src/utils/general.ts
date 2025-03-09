export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

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

export function generateMonthYears(startDate?: Date) {
  const monthYears: Array<{
    num: string;
    formatted: string;
  }> = [];

  const start = new Date(startDate ?? new Date());
  const current = new Date();

  start.setDate(1);
  current.setDate(1);

  while (
    start.getFullYear() < current.getFullYear() ||
    (start.getFullYear() === current.getFullYear() &&
      start.getMonth() <= current.getMonth()) // I don't fucking know anymore dude I just wanna sleep
  ) {
    const year = start.getFullYear();
    const month = start.getMonth() + 1;

    monthYears.push({
      num: `${year}${month.toString().padStart(2, "0")}`,
      formatted: start.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    });

    // Create a new date to avoid mutation
    start.setMonth(start.getMonth() + 1);
  }

  return monthYears;
}

export function getPostLink(post: any) {
  return `/${post.dateCreated.getFullYear()}/${(post.dateCreated.getMonth() + 1).toString().padStart(2, "0")}/${post.slug}`;
}