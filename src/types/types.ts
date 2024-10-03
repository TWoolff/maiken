import { Dispatch } from 'react';

export type AppContextType = {
	state: State;
	dispatch: Dispatch<Action>;
};

export type Action = {
	type: 'SET_STATE' | 'TOGGLE_LANGUAGE';
	payload?: Partial<State> | { id: string } | { key: string; value: string } | null;
};

// export type DataState = {
//     data?: string
// } | null | undefined | any

export type ErrorState = string | null;

export type State = {
	error: ErrorState | null;
	data: null; //  | DataState
	hasLoaded: boolean;
	language: 'da' | 'en';
};

type RichTextNode = {
	nodeType: string;
	content: Array<{
		nodeType: string;
		value?: string;
		content?: Array<RichTextNode>;
	}>;
};

type ProjectEntry = {
	metadata: {
		tags: any[];
	};
	sys: {
		id: string;
		type: string;
		createdAt: string;
		updatedAt: string;
		contentType: {
			sys: {
				id: string;
				type: string;
				linkType: string;
			};
		};
		locale: string;
	};
	fields: {
		title_dk: string;
		title_eng: string;
		slug: string;
		description_dk: RichTextNode;
		description_eng: RichTextNode;
	};
};

export type HomeData = {
	title: string;
	slug: string;
	projects: {
		sys: {
			id: string;
			type: string;
		};
		fields: {
			project: ProjectEntry[];
		};
	};
};
