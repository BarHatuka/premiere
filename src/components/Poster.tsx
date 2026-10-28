import { useState } from 'react'
import './Poster.css'

type PosterProps = {
  src: string
  alt: string
  fallbackText: string
}

// אם התמונה לא נטענת, מציגים במקומה את שם הסדרה.
export default function Poster({ src, alt, fallbackText }: PosterProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  if (status === 'failed') {
    // בלי alt (בכרטיס) מסתירים מקורא המסך, כי השם כבר כתוב מתחת
    return alt ? (
      <span className="poster poster--missing" role="img" aria-label={alt}>
        <span dir="ltr">{fallbackText}</span>
      </span>
    ) : (
      <span className="poster poster--missing" aria-hidden="true">
        <span dir="ltr">{fallbackText}</span>
      </span>
    )
  }

  return (
    <img
      className="poster"
      data-status={status}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('failed')}
    />
  )
}
