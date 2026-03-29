'use client'

export default function SocialsContent({ animate }) {
  const socials = [
    { name: 'Twitter / X', handle: '@sandeep98suresh', url: 'https://x.com/sandeep98suresh' },
    { name: 'GitHub', handle: 'sandeepsuresh1998', url: 'https://github.com/sandeepsuresh1998' },
  ]

  return (
    <>
      <div className={`content-item ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0s' }}>
        <h2>Socials</h2>
      </div>
      {socials.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div
            className={`content-item social-card ${animate ? 'animate-in' : ''}`}
            style={{ transitionDelay: `${0.15 * (i + 1)}s` }}
          >
            <div>
              <h3 style={{ marginBottom: '0.2rem' }}>{s.name}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>{s.handle}</p>
            </div>
          </div>
        </a>
      ))}
    </>
  )
}
