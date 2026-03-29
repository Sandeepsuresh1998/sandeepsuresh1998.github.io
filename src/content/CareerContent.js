'use client'

export default function CareerContent({ animate }) {
  const items = [
    {
      role: 'Software Engineer',
      company: 'Your Company',
      date: '2023 - Present',
      description: 'Building things that matter.',
    },
    {
      role: 'Previous Role',
      company: 'Previous Company',
      date: '2021 - 2023',
      description: 'Worked on interesting problems.',
    },
  ]

  return (
    <>
      <div className={`content-item ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0s' }}>
        <h2>Career</h2>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className={`content-item timeline-entry ${animate ? 'animate-in' : ''}`}
          style={{ transitionDelay: `${0.15 * (i + 1)}s` }}
        >
          <div className="timeline-date">{item.date}</div>
          <h3>{item.role}</h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
            {item.company}
          </p>
          <p>{item.description}</p>
        </div>
      ))}
    </>
  )
}
