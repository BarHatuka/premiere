import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import MyListProvider from './components/MyListProvider'
import HomePage from './pages/HomePage'
import MyListPage from './pages/MyListPage'
import NotFoundPage from './pages/NotFoundPage'
import ShowPage from './pages/ShowPage'
import TodayPage from './pages/TodayPage'

export default function App() {
  return (
    <MyListProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shows/:id" element={<ShowPage />} />
          <Route path="my-list" element={<MyListPage />} />
          <Route path="today" element={<TodayPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </MyListProvider>
  )
}
