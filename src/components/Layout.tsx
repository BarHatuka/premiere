import { Link, NavLink, Outlet } from 'react-router'
import { useMyList } from '../hooks/useMyList'
import ScrollToTop from './ScrollToTop'
import './Layout.css'

export default function Layout() {
  const myList = useMyList()

  return (
    <div className="layout">
      <ScrollToTop />

      <header className="site-header">
        <div className="site-header__brand">
          <Link to="/" className="site-header__title">
            פרמיירה
          </Link>
          <p className="site-header__tagline">הסדרה הבאה שלך מתחילה כאן.</p>
        </div>

        <nav className="site-nav" aria-label="ניווט ראשי">
          {/* end: בלי זה "כל הסדרות" היה מסומן בכל עמוד, כי כל כתובת מתחילה ב-"/" */}
          <NavLink to="/" end>
            כל הסדרות
          </NavLink>
          <NavLink to="/my-list">
            הרשימה שלי <span className="site-nav__count">{myList.shows.length}</span>
          </NavLink>
          <NavLink to="/today">היום בטלוויזיה</NavLink>
        </nav>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p>
          המידע והתמונות מ-<a href="https://www.tvmaze.com">TVmaze</a>, ברישיון{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.
        </p>
        <p>פרויקט הגמר של בר במכללת אונו, נבנה ב-React, ב-TypeScript וב-Vite.</p>
      </footer>
    </div>
  )
}
