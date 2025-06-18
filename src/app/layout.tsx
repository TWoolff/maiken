import type { Metadata } from 'next';
import { AppProvider } from '../services/context';
import Header from '@/components/header/header';
import '@/styles/index.css';
import { TransitionProvider } from '@/services/transitionContext';
import Transition from '@/components/transition/transition';

export const metadata: Metadata = {
	title: 'Maiken Vibe Bauer',
	description: 'Rum for Radikal Lytning',
	metadataBase: new URL('https://maikenvibe.info/'),
	openGraph: {
		type: 'website',
		url: 'https://maikenvibe.info/',
		title: 'Maiken Vibe Bauer',
		description: 'Rum for Radikal Lytning',
		locale: 'en_US',
	},
	alternates: {
		canonical: '/',
	},
	icons: {
		icon: '/assets/icons/favicon.jpg',
	},
};

const RootLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<html lang='en'>
			<body>
				<AppProvider>
					<TransitionProvider>
						<Header />
						<Transition />
						{children}
					</TransitionProvider>
				</AppProvider>
			</body>
		</html>
	);
};

export default RootLayout;
