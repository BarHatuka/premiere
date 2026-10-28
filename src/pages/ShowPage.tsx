import { useParams } from 'react-router'
import { showUrl } from '../api/tvmaze'
import BackLink from '../components/BackLink'
import ShowDetail from '../components/ShowDetail'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import type { ShowWithCast } from '../types/tvmaze'
import NotFoundPage from './NotFoundPage'

export default function ShowPage() {
  const { id = '' } = useParams()
  const isValidId = /^\d+$/.test(id)

  // העמוד טוען את הסדרה לפי המזהה שבכתובת, ולכן הוא עובד גם בכניסה ישירה ואחרי רענון
  const { state, retry } = useFetch<ShowWithCast>(isValidId ? showUrl(id) : null)

  if (!isValidId) return <NotFoundPage />
  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את הסדרה…" />
  if (state.status === 'error') {
    if (state.notFound) return <NotFoundPage />
    return <StatusMessage type="error" title="לא הצלחנו לטעון את הסדרה" details={state.message} onRetry={retry} />
  }

  const show = state.data

  return (
    <>
      <title>{`${show.name} | פרמיירה`}</title>
      <BackLink />
      {/* key: לסדרה אחרת יש רכיב חדש, כך שמצב הפוסטר של הקודמת לא עובר אליה */}
      <ShowDetail key={show.id} show={show} />
    </>
  )
}
