# PRD — Première (פרמיירה)

## 1. One-sentence pitch
A Hebrew guide to TV series: a wall of posters, a page for every show, a personal watch list and today's TV schedule.

## 2. Who it is for
Hebrew speakers looking for their next series. They want the essentials of a show on one screen (rating, genres, network, broadcast time, cast and summary), a simple way to remember the shows they liked, and a link they can send to a friend.

## 3. Screens
1. The wall, `/`: posters of the shows, highest rated first. Each poster shows the name, premiere year and rating. Above the wall: a search box and genre filters.
2. A show page, `/shows/:id` (for example `/shows/2`): a large poster, the name, one line about where and when the show aired, genres, rating, episode length, language, summary, the main cast, a save button, and links to TVmaze and the official site.
3. My list (הרשימה שלי), `/my-list`: the shows I saved, with a way to remove each one.
4. On TV today (היום בטלוויזיה), `/today`: today's US broadcast schedule, by hour. Each entry links to the show's page.
5. Not found, any other address: a short message and a link back to the wall.

Every page has a header with links to the wall, my list and today's schedule.

## 4. Must-have features
1. Load the data from TVmaze, with a loading state and an error state with a "נסו שוב" (try again) button, on every page that fetches.
2. A separate address for every page and for every show. Opening an address directly, or refreshing on it, shows the same page.
3. Search shows by name and filter by genre. Both are kept in the address, so going back from a show returns to the same filtered wall.
4. Save shows to "הרשימה שלי", kept after a page refresh.
5. Today's schedule, grouped by hour.

## 5. Acceptance criteria
- When I open the app, I see "טוענים את הסדרות…" and then a wall of posters, highest rated first; when the network is offline, I see an error message and a "נסו שוב" button, not a blank screen.
- When I click "Person of Interest", I see the address `/shows/2`, its rating 8.8, the line "שודרה בין 2011 ל-2016 ב-CBS" and its cast, and I see the same after refreshing the page.
- When I pick the "קומדיה" genre and type "new" in the search box, I see only comedies with "new" in their name, like New Girl, and the address ends with `?genre=Comedy&q=new`.
- When I save a show and refresh the page, I see it in "הרשימה שלי".
- When I open "היום בטלוויזיה", I see today's shows by hour, and clicking a show opens its page.

## 6. Not now
- Searching the whole TVmaze catalog (the search works on the shows that were loaded).
- Seasons and episode lists for a show.
- Sorting by anything other than rating.
- A light theme.
- Accounts, or syncing "הרשימה שלי" between devices.

## 7. Data
TVmaze API: free, no key, open to the browser (CORS). Data and images © TVmaze, CC BY-SA 4.0, credited in the footer.
- `https://api.tvmaze.com/shows`: the wall. Page 0 of the catalog, about 240 shows.
- `https://api.tvmaze.com/shows/:id?embed=cast`: a show page together with its cast, so the page works without loading the wall first.
- `https://api.tvmaze.com/schedule?country=US`: today's schedule.

Fields in the list: `id`, `name`, `image.medium`, `premiered`, `rating.average`, `genres`.
Fields in the details: the list fields, plus `image.original`, `status`, `ended`, `network.name` or `webChannel.name`, `schedule`, `runtime` or `averageRuntime`, `language`, `summary` (HTML, shown as plain text), `url`, `officialSite`, and `_embedded.cast` (actor and character names).
Fields in the schedule: `airdate`, `airtime`, `name`, `season`, `number`, `show.id`, `show.name`, `show.network.name`.
Saved in the browser: `localStorage` key `premiere:my-list`, with the card fields of each saved show, so the page needs no request.
