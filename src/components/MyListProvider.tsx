import { useEffect, useState, type ReactNode } from 'react'
import { MyListContext } from '../hooks/useMyList'
import type { Show } from '../types/tvmaze'
import { loadMyList, storeMyList, toggleShow } from '../utils/myList'

type MyListProviderProps = {
  children: ReactNode
}

export default function MyListProvider({ children }: MyListProviderProps) {
  // loadMyList בלי סוגריים: React קורא לה רק ברינדור הראשון.
  const [shows, setShows] = useState<Show[]>(loadMyList)

  useEffect(() => {
    storeMyList(shows)
  }, [shows])

  const value = {
    shows,
    isSaved: (id: number) => shows.some((show) => show.id === id),
    toggle: (show: Show) => setShows((current) => toggleShow(current, show)),
  }

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
}
