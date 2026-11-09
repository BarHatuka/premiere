// "הרשימה שלי" מה-Context
import { useMyList } from '../hooks/useMyList'
// הטיפוס של סדרה
import type { Show } from '../types/tvmaze'
// אייקון הלב
import Icon from './Icon'

// ה-props: הסדרה שהכפתור שומר
type SaveButtonProps = {
  show: Show
}

// כפתור "שמירה לרשימה שלי" בעמוד הסדרה
export default function SaveButton({ show }: SaveButtonProps) {
  // הרשימה והפונקציות שלה
  const myList = useMyList()
  // האם הסדרה כבר שמורה
  const saved = myList.isSaved(show.id)

  // מה שהרכיב מציג
  return (
    // לחיצה שומרת או מסירה (toggle). כששמורה, הכפתור מקבל עיצוב בולט (button--primary)
    <button type="button" className={saved ? 'button button--primary' : 'button'} onClick={() => myList.toggle(show)}>
      {/* לב מלא כשהסדרה שמורה, ריק כשלא */}
      <Icon name="heart" filled={saved} />
      {/* הטקסט משתנה לפי המצב */}
      {saved ? 'הסרה מהרשימה שלי' : 'שמירה לרשימה שלי'}
    </button>
  )
}
