import { Link } from 'react-router'
import { SCHEDULE_URL } from '../api/tvmaze'
import StatusMessage from '../components/StatusMessage'
import { useFetch } from '../hooks/useFetch'
import type { ScheduleEntry } from '../types/tvmaze'
import { describeEpisode, formatAirdate, groupByHour } from '../utils/schedule'
import './TodayPage.css'

export default function TodayPage() {
  const { state, retry } = useFetch<ScheduleEntry[]>(SCHEDULE_URL)

  if (state.status === 'loading') return <StatusMessage type="loading" text="טוענים את לוח השידורים…" />
  if (state.status === 'error') {
    return <StatusMessage type="error" title="לא הצלחנו לטעון את לוח השידורים" details={state.message} onRetry={retry} />
  }

  const entries = state.data
  const groups = groupByHour(entries)

  return (
    <section className="today" aria-labelledby="today-title">
      <title>היום בטלוויזיה | פרמיירה</title>
      <h1 id="today-title" className="page-title">
        היום בטלוויזיה
      </h1>
      <p className="today__intro">
        {entries.length > 0 && `${formatAirdate(entries[0].airdate)} · `}
        לוח השידורים בארה"ב. השעות לפי שעון הרשת, ולא לפי שעון ישראל.
      </p>

      {groups.length === 0 && <p>היום אין שידורים בלוח של TVmaze.</p>}

      {groups.map((group) => (
        <section key={group.hour} className="today__hour">
          <h2 className="today__hour-title">{group.hour || 'בלי שעה קבועה'}</h2>
          <ul className="today__list">
            {group.entries.map((entry) => (
              <li key={entry.id} className="today__entry">
                <span className="today__time">{entry.airtime}</span>
                <Link to={`/shows/${entry.show.id}`} className="today__show" dir="ltr">
                  {entry.show.name}
                </Link>
                <span className="today__episode">
                  {describeEpisode(entry)}
                  {entry.name && (
                    <>
                      {' · '}
                      <span dir="ltr">{entry.name}</span>
                    </>
                  )}
                </span>
                {entry.show.network && (
                  <span className="today__network" dir="ltr">
                    {entry.show.network.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
