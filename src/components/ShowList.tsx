import type { Show } from '../types/tvmaze'
import ShowCard from './ShowCard'
import './ShowList.css'

type ShowListProps = {
  shows: Show[]
}

export default function ShowList({ shows }: ShowListProps) {
  return (
    <ul className="show-list">
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} />
        </li>
      ))}
    </ul>
  )
}
