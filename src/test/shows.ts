import { vi } from 'vitest'
import type { ScheduleEntry, ShowDetails, ShowWithCast } from '../types/tvmaze'

// סדרה לבדיקות, במבנה של TVmaze. כל בדיקה משנה רק את השדות שחשובים לה.
export function makeShow(overrides: Partial<ShowDetails> = {}): ShowDetails {
  return {
    id: 1,
    url: 'https://www.tvmaze.com/shows/1/test',
    name: 'Test Show',
    language: 'English',
    genres: ['Drama'],
    status: 'Ended',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2010-01-01',
    ended: '2012-01-01',
    officialSite: null,
    schedule: { time: '21:00', days: ['Monday'] },
    rating: { average: 7 },
    network: { name: 'ABC' },
    webChannel: null,
    image: {
      medium: 'https://static.tvmaze.com/test-medium.jpg',
      original: 'https://static.tvmaze.com/test-original.jpg',
    },
    summary: '<p>A test summary.</p>',
    ...overrides,
  }
}

// הערכים של Person of Interest הועתקו מהתשובה האמיתית של https://api.tvmaze.com/shows/2.
export const personOfInterest = makeShow({
  id: 2,
  name: 'Person of Interest',
  genres: ['Action', 'Crime', 'Science-Fiction'],
  premiered: '2011-09-22',
  ended: '2016-06-21',
  schedule: { time: '22:00', days: ['Tuesday'] },
  rating: { average: 8.8 },
  network: { name: 'CBS' },
  summary: '<p>You are being watched. The government has a secret system, a machine that spies on you every hour of every day.</p>',
})

export const personOfInterestWithCast: ShowWithCast = {
  ...personOfInterest,
  _embedded: {
    cast: [
      { person: { id: 1, name: 'Jim Caviezel' }, character: { id: 1, name: 'John Reese' } },
      { person: { id: 2, name: 'Michael Emerson' }, character: { id: 2, name: 'Harold Finch' } },
    ],
  },
}

// הסדרות של הקיר בבדיקות, בסדר "מבולגן" בכוונה, כדי לבדוק שהקיר ממיין אותן לפי דירוג.
export const testShows = [
  makeShow({ id: 8, name: 'Glee', genres: ['Drama', 'Music', 'Romance'], rating: { average: 6.6 } }),
  personOfInterest,
  makeShow({ id: 58, name: 'New Girl', genres: ['Comedy', 'Romance'], rating: { average: 7.3 } }),
  makeShow({ id: 45, name: 'NCIS: New Orleans', genres: ['Drama', 'Action', 'Crime'], rating: { average: 7.5 } }),
  makeShow({ id: 66, name: 'The Big Bang Theory', genres: ['Comedy'], rating: { average: 8 } }),
  makeShow({ id: 40, name: 'Death Note', genres: ['Anime', 'Fantasy', 'Thriller'], rating: { average: null } }),
]

// fetch מדומה: לכל כתובת יש תשובה מוכנה, וכתובת שלא ברשימה מחזירה 404, כמו TVmaze
export function fakeTvmaze(answers: Record<string, unknown>) {
  return vi.fn(async (input: string | URL | Request) => {
    const url = String(input)
    if (url in answers) return new Response(JSON.stringify(answers[url]), { status: 200 })
    return new Response('Not Found', { status: 404 })
  })
}

// שידור אחד בלוח של היום
export function makeEntry(overrides: Partial<ScheduleEntry> = {}): ScheduleEntry {
  return {
    id: 1,
    name: 'Pilot',
    season: 1,
    number: 1,
    airdate: '2026-10-17',
    airtime: '20:00',
    show: makeShow(),
    ...overrides,
  }
}

export const todaysSchedule = [
  makeEntry({ id: 101, airtime: '22:00', show: personOfInterest, season: 5, number: 13, name: 'return 0' }),
  makeEntry({ id: 102, airtime: '20:00', show: testShows[0], season: 6, number: 1, name: 'Loser Like Me' }),
]

export const defaultAnswers = {
  'https://api.tvmaze.com/shows': testShows,
  'https://api.tvmaze.com/shows/2?embed=cast': personOfInterestWithCast,
  'https://api.tvmaze.com/schedule?country=US': todaysSchedule,
}
