export interface CalendarEvent {
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional (defaults to 1 hour after start)
  location?: string;
  url?: string;
}

/**
 * Formats a date for calendar URLs (YYYYMMDDTHHMMSSZ format)
 */
function formatCalendarDate(dateString: string): string {
  const date = new Date(dateString);
  // If the date doesn't include time (just date), set it to 19:00 (7 PM)
  if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    date.setHours(19, 0, 0, 0); // 7 PM default time for events
  }
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Generates calendar links for various calendar applications
 */
export function generateCalendarLinks(event: CalendarEvent) {
  const startDate = formatCalendarDate(event.startDate);

  // Default end date is 3 hours after start if not provided (typical event duration)
  const endDate = event.endDate ? formatCalendarDate(event.endDate) : formatCalendarDate(new Date(new Date(event.startDate).getTime() + 3 * 60 * 60 * 1000).toISOString());

  const encodedTitle = encodeURIComponent(event.title);
  const encodedDescription = encodeURIComponent(event.description);
  const encodedLocation = event.location ? encodeURIComponent(event.location) : "";

  // Google Calendar
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startDate}/${endDate}&details=${encodedDescription}&location=${encodedLocation}`;

  // Outlook Calendar (web)
  const outlookWebUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodedTitle}&startdt=${event.startDate}&enddt=${event.endDate || new Date(new Date(event.startDate).getTime() + 3 * 60 * 60 * 1000).toISOString()}&body=${encodedDescription}&location=${encodedLocation}`;

  // ICS file format (for Apple Calendar, Outlook desktop, etc.)
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Blat Vodka//Event//EN",
    "BEGIN:VEVENT",
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    event.location ? `LOCATION:${event.location}` : "",
    event.url ? `URL:${event.url}` : "",
    `UID:${Date.now()}@blatvodka.com`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((line) => line)
    .join("\r\n");

  const icsBlob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const icsUrl = URL.createObjectURL(icsBlob);

  return {
    google: googleCalendarUrl,
    outlook: outlookWebUrl,
    ics: icsUrl,
    icsContent,
  };
}

/**
 * Downloads an ICS file for the event
 */
export function downloadICSFile(event: CalendarEvent, filename?: string) {
  const { icsContent } = generateCalendarLinks(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
