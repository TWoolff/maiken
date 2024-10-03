import type { Metadata } from 'next'
import { AppProvider } from '../services/context'
import Header from '@/components/header/header'
import '@/styles/index.css'

export const metadata: Metadata = {
	title: 'Maiken',
	description: 'Sound Artist',
	metadataBase: new URL("https://maikenvibe.info/"),
    openGraph: {
        type: "website",
        url: "https://maikenvibe.info/",
        title: "Maiken Vibe Bauer",
        description: "Rum for Radikal Lytning",
        locale: "en_US",
    },
    alternates: {
        canonical: "/",
    },
    icons: {
        icon: "/assets/icons/favicon.png",
    },
}

const RootLayout: React.FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <html lang='en'>
      <body>
        <AppProvider>
          <Header />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

export default RootLayout
