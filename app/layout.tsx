import './globals.css'

export const metadata = {
  title: 'UrbanColl - Connecting Buyers with Right Vendors',
  description: 'Multi-vendor marketplace for goods, food, snacks, and services in Sokoto, Nigeria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}