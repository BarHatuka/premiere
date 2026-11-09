// beforeEach: קוד שרץ לפני כל בדיקה
import { beforeEach, expect, test } from 'vitest'
// סדרות מזויפות לבדיקות
import { makeShow, personOfInterest } from '../test/shows'
// הפונקציות שבודקים
import { loadMyList, storeMyList, toSavedShow, toggleShow } from './myList'

// כל בדיקה מתחילה בלי רשימה שמורה
beforeEach(() => localStorage.clear())

// בדיקה: toggle מוסיף סדרה שלא שמורה, ומסיר סדרה ששמורה
test('toggleShow adds a show that is not saved, and removes one that is', () => {
  // סדרה לבדיקה
  const glee = makeShow({ id: 8, name: 'Glee' })
  // מוסיפים לרשימה ריקה
  const saved = toggleShow([], glee)
  // עכשיו היא ברשימה
  expect(saved.map((show) => show.id)).toEqual([8])
  // toggle נוסף מסיר אותה
  expect(toggleShow(saved, glee)).toEqual([])
})

// בדיקה: toggle מחזיר מערך חדש ולא משנה את הישן. זה מה ש-React צריך כדי לזהות שינוי ב-state
test('toggleShow returns a new array and keeps the old one as it was', () => {
  // רשימה ריקה. ReturnType: הטיפוס ש-loadMyList מחזירה
  const before: ReturnType<typeof loadMyList> = []
  // מוסיפים סדרה
  const after = toggleShow(before, personOfInterest)
  // not.toBe: זה לא אותו מערך בזיכרון
  expect(after).not.toBe(before)
  // והמערך הישן נשאר ריק
  expect(before).toHaveLength(0)
})

// בדיקה: נשמרים רק השדות של הכרטיס
test('only the card fields are saved, not the summary or the schedule', () => {
  // Object.keys: שמות השדות. sort: כדי שהסדר לא ישנה
  expect(Object.keys(toSavedShow(personOfInterest)).sort()).toEqual(['genres', 'id', 'image', 'name', 'premiered', 'rating'])
})

// בדיקה: שמירה וטעינה, ומידע פגום שנותן רשימה ריקה
test('what is stored comes back after loading, and broken data gives an empty list', () => {
  // שומרים סדרה אחת
  storeMyList([toSavedShow(personOfInterest)])
  // וטוענים אותה בחזרה
  expect(loadMyList()[0].name).toBe('Person of Interest')

  // שמים ב-localStorage טקסט שאינו JSON תקין
  localStorage.setItem('premiere:my-list', '{not json')
  // הטעינה לא קורסת, ומחזירה רשימה ריקה
  expect(loadMyList()).toEqual([])
})
