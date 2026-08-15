const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Deterministically formats an ISO timestamp in IST (Indian Standard Time, UTC+5:30)
 * matching the Kerala Idamalayar EAP incident timeline across both SSR and browser client.
 * Completely immune to server-client timezone variance or ICU locale mismatch.
 */
export function formatTimestamp(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;

    // IST is UTC + 5:30 (330 minutes)
    const istMillis = d.getTime() + 330 * 60 * 1000;
    const istDate = new Date(istMillis);

    const day = istDate.getUTCDate();
    const month = MONTHS[istDate.getUTCMonth()];
    const year = istDate.getUTCFullYear();

    let hours = istDate.getUTCHours();
    const minutes = String(istDate.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return iso;
  }
}

/**
 * Formats a number with Indian grouping system (e.g. 1,50,000).
 */
export function formatIndianNumber(num: number): string {
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-IN");
}

/**
 * Converts amount in lakhs to formatted crores string (e.g. 15.50 Cr).
 */
export function formatCrores(lakhs: number): string {
  if (isNaN(lakhs)) return "0";
  return (lakhs / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
