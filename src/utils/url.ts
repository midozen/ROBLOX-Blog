export function capitalizeDomainPrefix(domain: string) {
  const parts = domain.split(".");

  return parts[0].toUpperCase() + "." + parts[1];
}

export function getPostUrl(post: any, accurateDates: Boolean = false) {
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