'use client'

export default function BlogContent({ animate }) {
  const posts = [
    {
      title: 'My Favorite 3D Prints',
      date: 'August 2024',
      excerpt: 'A collection of my favorite things I\'ve printed on my Bambu P1P.',
      links: [
        { name: 'Nespresso Pod Holders', url: 'https://www.thingiverse.com/thing:6649498' },
        { name: 'iPad Stand', url: 'https://www.thingiverse.com/thing:6654637' },
        { name: 'iPhone StandBy Dock', url: 'https://makerworld.com/en/models/510498' },
      ],
    },
  ]

  return (
    <>
      <div className={`content-item ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0s' }}>
        <h2>Blog</h2>
      </div>
      {posts.map((post, i) => (
        <div
          key={i}
          className={`content-item blog-card ${animate ? 'animate-in' : ''}`}
          style={{ transitionDelay: `${0.15 * (i + 1)}s` }}
        >
          <h3>{post.title}</h3>
          <p className="date">{post.date}</p>
          <p>{post.excerpt}</p>
          {post.links && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {post.links.map((link, j) => (
                <li key={j} style={{ marginBottom: '0.4rem' }}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name} &rarr;
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  )
}
