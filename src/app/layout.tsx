import type { Metadata } from 'next'
import { AppProvider } from '../utils/context'
import '@/styles/index.css'

export const metadata: Metadata = {
	title: 'Maiken',
	description: 'Sound Artist',
	metadataBase: new URL("https://prettyugly.fashion/"),
    openGraph: {
        type: "website",
        url: "https://prettyugly.fashion/",
        title: "Maiken",
        description: "Sound Artist",
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
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

export default RootLayout
