import { createContext, useContext } from 'react'
import type { Show } from '../types/tvmaze'

export type MyList = {
  shows: Show[]
  isSaved: (id: number) => boolean
  toggle: (show: Show) => void
}

export const MyListContext = createContext<MyList | null>(null)

export function useMyList(): MyList {
  const myList = useContext(MyListContext)
  if (!myList) throw new Error('useMyList must be used inside <MyListProvider>')
  return myList
}
