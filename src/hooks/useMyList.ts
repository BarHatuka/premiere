// ─────────────────────────────────────────────
// ה-Context של "הרשימה שלי": הטיפוס, הערוץ עצמו, ו-hook לקריאה ממנו.
// משתמשים בו ב: Layout (המונה), ‏ShowCard (הלב), ‏SaveButton, ‏MyListPage, ו-MyListProvider שמספק את הערך.
// למה Context ולא props: כמה רכיבים שרחוקים זה מזה צריכים את אותה רשימה. עם props היה צריך להעביר אותה דרך רכיבים שבכלל לא משתמשים בה (prop drilling).
// ─────────────────────────────────────────────

// createContext יוצר "ערוץ" משותף, ו-useContext קורא ממנו
import { createContext, useContext } from 'react'
// import type: מייבאים רק טיפוס, שלא קיים בקוד שרץ בדפדפן
import type { Show } from '../types/tvmaze'

// מה שכל רכיב מקבל מ"הרשימה שלי"
export type MyList = {
  // הסדרות השמורות
  shows: Show[]
  // פונקציה: האם סדרה עם המזהה הזה שמורה?
  isSaved: (id: number) => boolean
  // פונקציה: שומרת סדרה, או מסירה אותה אם היא כבר שמורה
  toggle: (show: Show) => void
}

// הערוץ עצמו. ערך ההתחלה null, כי מחוץ ל-MyListProvider אין רשימה
export const MyListContext = createContext<MyList | null>(null)

// hook שכל רכיב משתמש בו כדי לקבל את הרשימה, למשל SaveButton ו-Layout
export function useMyList(): MyList {
  // קוראים את הערך מה-Provider הקרוב ביותר שמעל הרכיב
  const myList = useContext(MyListContext)
  // אם אין Provider מעל, זו טעות של מתכנת: זורקים שגיאה ברורה
  if (!myList) throw new Error('useMyList must be used inside <MyListProvider>')
  // מחזירים את הרשימה. TypeScript כבר יודע שהיא לא null
  return myList
}
