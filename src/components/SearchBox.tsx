import Icon from './Icon'
import './SearchBox.css'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="search-box">
      <label className="visually-hidden" htmlFor="show-search">
        חיפוש סדרה לפי שם
      </label>
      <span className="search-box__icon">
        <Icon name="search" />
      </span>
      <input
        id="show-search"
        className="search-box__input"
        type="search"
        dir="auto"
        value={value}
        placeholder="חיפוש לפי שם הסדרה, באנגלית"
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="search-box__clear" aria-label="ניקוי החיפוש" onClick={() => onChange('')}>
          <Icon name="close" />
        </button>
      )}
    </div>
  )
}
