// render מצייר רכיב. screen מחפש בו. within מחפש בתוך אלמנט מסוים
import { render, screen, within } from '@testing-library/react'
// MemoryRouter: ראוטר לבדיקות, בלי שורת כתובת אמיתית
import { MemoryRouter } from 'react-router'
// כלי הבדיקה של Vitest
import { expect, test } from 'vitest'
// סדרות לדוגמה
import { testShows } from '../test/shows'
// הכרטיסים צריכים את "הרשימה שלי"
import MyListProvider from './MyListProvider'
// הרכיב שבודקים
import ShowList from './ShowList'

// בדיקה: כרטיס לכל סדרה, עם שם, שנה, דירוג וקישור
test('shows a card for every show, with its name, year and rating, linking to the show page', () => {
  // כל כרטיס הוא Link (צריך ראוטר מסביבו), ומסמן לב לסדרה שמורה (צריך את "הרשימה שלי")
  render(
    <MemoryRouter>
      <MyListProvider>
        <ShowList shows={testShows} />
      </MyListProvider>
    </MemoryRouter>,
  )

  // כל פריטי הרשימה (li)
  const items = screen.getAllByRole('listitem')
  // פריט לכל סדרה
  expect(items).toHaveLength(testShows.length)

  // הכרטיס השני
  const personOfInterest = items[1]
  // השם
  expect(personOfInterest).toHaveTextContent('Person of Interest')
  // השנה
  expect(personOfInterest).toHaveTextContent('2011')
  // הדירוג, כולל המילה שרק קורא מסך שומע
  expect(personOfInterest).toHaveTextContent('דירוג 8.8')
  // והקישור מוביל לעמוד הסדרה
  expect(within(personOfInterest).getByRole('link')).toHaveAttribute('href', '/shows/2')
})
