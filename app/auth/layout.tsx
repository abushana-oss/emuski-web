import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Processing',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    'max-video-preview': -1,
    'max-image-preview': 'none',
    'max-snippet': -1,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow, nocache, noarchive, nosnippet, noimageindex" />
      {children}
    </>
  )
}