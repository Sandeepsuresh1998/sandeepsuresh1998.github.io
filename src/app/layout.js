import './globals.css'

export const metadata = {
  title: "Sandeep Suresh",
  description: "Sandeep's personal website",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
