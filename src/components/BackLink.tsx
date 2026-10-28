import { Link, useLocation, useNavigate } from 'react-router'
import Icon from './Icon'
import './BackLink.css'

// כניסה ישירה לכתובת (key === 'default'): אין עמוד קודם באפליקציה, אז מקשרים לקיר.
// אחרת חוזרים צעד אחד, והקיר חוזר עם החיפוש והסינון שהיו בו.
export default function BackLink() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.key === 'default') {
    return (
      <Link to="/" className="back-link">
        <Icon name="back" />
        לכל הסדרות
      </Link>
    )
  }

  return (
    <button type="button" className="back-link" onClick={() => navigate(-1)}>
      <Icon name="back" />
      חזרה
    </button>
  )
}
