import 'react';

declare module 'react' {
	interface ViewTransitionProps {
		name: string;
		children: React.ReactNode;
		className?: string;
	}

	// Augment the module, don't replace it!
	// If you want to add unstable_ViewTransition, do:
	// (You may need to use 'var' instead of 'const' for module augmentation)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const unstable_ViewTransition: React.FC<ViewTransitionProps>;

	// If you want to add use, do:
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function use<T>(promise: Promise<T>): T;
}
