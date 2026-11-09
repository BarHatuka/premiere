// כלי הבדיקה של Vitest
import { describe, expect, test } from 'vitest'
// סדרות לדוגמה. personOfInterest הועתקה מתשובה אמיתית של TVmaze
import { makeShow, personOfInterest } from '../test/shows'
// הפונקציות שבודקים
import { describeBroadcast, formatList, formatRating, formatRuntime, getYear, htmlToText } from './format'

// הבדיקות של getYear
describe('getYear', () => {
  // מוציאה את השנה מתאריך
  test('takes the year from a TVmaze date', () => {
    // 2011-09-22 → 2011
    expect(getYear('2011-09-22')).toBe('2011')
  })

  // בלי תאריך: מחרוזת ריקה
  test('returns an empty string when there is no date', () => {
    // null → ''
    expect(getYear(null)).toBe('')
  })
})

// הבדיקות של formatRating
describe('formatRating', () => {
  // תמיד ספרה אחת אחרי הנקודה
  test('always shows one digit after the point', () => {
    // 8.8 נשאר 8.8
    expect(formatRating(8.8)).toBe('8.8')
    // 8 הופך ל-8.0
    expect(formatRating(8)).toBe('8.0')
  })

  // בלי דירוג: null
  test('returns null when the show has no rating', () => {
    // toBeNull: מצפים בדיוק ל-null
    expect(formatRating(null)).toBeNull()
  })
})

// הבדיקות של המשפט על השידור
describe('describeBroadcast', () => {
  // סדרה שהסתיימה, עם הנתונים האמיתיים של Person of Interest
  test('a show that ended: years, channel and time slot (Person of Interest, from the real data)', () => {
    // שנים, רשת וזמן שידור
    expect(describeBroadcast(personOfInterest)).toBe(
      'שודרה בין 2011 ל-2016 ב-CBS, בימי שלישי בשעה 22:00 (לפי שעון הרשת).',
    )
  })

  // סדרה שעדיין משודרת
  test('a show that is still running', () => {
    // סדרה מזויפת עם השדות שהבדיקה צריכה
    const show = makeShow({
      status: 'Running',
      premiered: '2014-01-12',
      ended: null,
      network: { name: 'HBO' },
      schedule: { time: '21:00', days: ['Sunday'] },
    })
    // "משודרת מאז"
    expect(describeBroadcast(show)).toBe('משודרת מאז 2014 ב-HBO, בימי ראשון בשעה 21:00 (לפי שעון הרשת).')
  })

  // סדרת סטרימינג בלי זמן שידור קבוע
  test('a streaming show with no fixed time slot', () => {
    // בלי network, עם webChannel, ובלי ימים
    const show = makeShow({
      premiered: '2013-04-19',
      ended: '2015-10-23',
      network: null,
      webChannel: { name: 'Netflix' },
      schedule: { time: '', days: [] },
    })
    // השם של שירות הסטרימינג, ובלי ימים ושעה
    expect(describeBroadcast(show)).toBe('שודרה בין 2013 ל-2015 ב-Netflix.')
  })

  // כמה ימים מחוברים בפסיקים ו"ו"
  test('several days are joined the Hebrew way', () => {
    // שלושה ימים
    const show = makeShow({ schedule: { time: '', days: ['Monday', 'Tuesday', 'Wednesday'] } })
    // toContain: המשפט מכיל את החלק הזה
    expect(describeBroadcast(show)).toContain('בימי שני, שלישי ורביעי')
  })

  // סדרה שעוד לא עלתה
  test('a show that has not aired yet', () => {
    // בלי תאריך התחלה
    const show = makeShow({ status: 'In Development', premiered: null, ended: null, schedule: { time: '', days: [] } })
    // "עוד לא עלתה לשידור."
    expect(describeBroadcast(show)).toBe('עוד לא עלתה לשידור.')
  })
})

// בדיקות לפונקציות הקטנות
describe('small helpers', () => {
  // formatList: פסיקים ו"ו" לפני האחרון
  test('formatList joins with commas and "ו"', () => {
    // שלושה פריטים
    expect(formatList(['דרמה', 'פשע', 'מתח'])).toBe('דרמה, פשע ומתח')
  })

  // formatRuntime: כשאין runtime לוקחים את averageRuntime
  test('formatRuntime falls back to averageRuntime', () => {
    // רק averageRuntime
    expect(formatRuntime({ runtime: null, averageRuntime: 45 })).toBe('כ-45 דקות')
    // אין אף אחד: null
    expect(formatRuntime({ runtime: null, averageRuntime: null })).toBeNull()
  })

  // htmlToText: מוחק תגיות ומפענח תווים כמו &amp;
  test('htmlToText removes tags and decodes entities', () => {
    // HTML ← טקסט רגיל
    expect(htmlToText('<p><b>Glee</b> is fun &amp; loud</p>')).toBe('Glee is fun & loud')
    // null ← מחרוזת ריקה
    expect(htmlToText(null)).toBe('')
  })
})
