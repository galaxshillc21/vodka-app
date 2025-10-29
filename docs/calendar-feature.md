# Calendar Integration Feature

This feature allows users to add Blat Vodka events to their native calendar applications.

## How it works

### User Experience

- Users see an "Add to Calendar" link below event dates on both the events listing page and individual event detail pages
- Clicking the link downloads an `.ics` file that can be opened by any calendar application
- The link is styled as a simple text link with a calendar icon

### Technical Implementation

#### Files Created/Modified:

1. **`src/utils/calendar.ts`** - New utility for generating calendar files
2. **`src/app/[locale]/events/EventDetailClient.tsx`** - Added calendar link to event detail page
3. **`src/app/[locale]/events/EventsPageClient.tsx`** - Added calendar link to events listing page
4. **Translation files** - Added "Add to Calendar" translations

#### Calendar Functionality:

- **Format**: Generates `.ics` (iCalendar) files compatible with all major calendar applications
- **Default Timing**: Events without specific times default to 7:00 PM (19:00)
- **Duration**: Events default to 3-hour duration
- **Data Included**:
  - Event title
  - Date and time
  - Location (venue, town, municipality)
  - Description
  - Event URL

#### Compatibility:

- ✅ Google Calendar
- ✅ Apple Calendar (macOS, iOS)
- ✅ Outlook (Desktop, Web, Mobile)
- ✅ Thunderbird
- ✅ Any iCalendar-compatible application

#### Browser Behavior:

- Downloads `.ics` file to user's default download folder
- File is automatically named based on the event title
- Most systems will open the file with the default calendar application
- Users can choose which calendar to add the event to

## Implementation Details

### Calendar Utility (`src/utils/calendar.ts`)

The utility provides:

- `CalendarEvent` interface for type safety
- `generateCalendarLinks()` function for creating various calendar formats
- `downloadICSFile()` function for triggering file downloads
- Proper date/time formatting for calendar standards

### User Interaction

The calendar feature is implemented as a simple click-to-download:

1. User clicks "Add to Calendar" link
2. Browser downloads `.ics` file
3. User opens file (usually automatic)
4. Calendar app opens with event pre-filled
5. User confirms to add event to their calendar

### Styling

- Consistent with existing design system
- Uses amber color scheme matching the brand
- Small calendar icon for visual context
- Subtle underline on hover for accessibility

## Future Enhancements (Optional)

- Multi-calendar provider dropdown (Google, Outlook, Apple)
- Direct calendar API integration (requires authentication)
- Recurring event support
- Reminder/notification preferences
