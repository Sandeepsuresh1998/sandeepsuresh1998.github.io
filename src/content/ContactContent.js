'use client'

export default function ContactContent({ animate }) {
  return (
    <>
      <div className={`content-item ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0s' }}>
        <h2>Contact</h2>
      </div>
      <div className={`content-item ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0.15s' }}>
        <p>Want to get in touch? Reach out anytime.</p>
      </div>
      <div className={`content-item ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0.3s' }}>
        <p>
          <a href="mailto:sandeep@example.com">sandeep@example.com</a>
        </p>
      </div>
    </>
  )
}
