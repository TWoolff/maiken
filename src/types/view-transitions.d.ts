declare module 'react' {
	import { ReactNode } from 'react';

	interface ViewTransitionProps {
		name: string;
		children: ReactNode;
		className?: string;
	}

	export const unstable_ViewTransition: React.FC<ViewTransitionProps>;

	export function use<T>(promise: Promise<T>): T;
}
