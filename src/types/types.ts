import { Dispatch } from 'react';

export type AppContextType = {
	state: State;
	dispatch: Dispatch<Action>;
};

export type Action = {
	type: 'SET_STATE' | 'TOGGLE_LANGUAGE';
	payload?: Partial<State> | { id: string } | { key: string; value: string } | null;
};

export type DataState = {
    data?: HomeData
} | null | undefined | any;

export type ErrorState = string | null;

export type State = {
	error: ErrorState | null;
	data: null | DataState;
	hasLoaded: boolean;
	language: 'da' | 'en';
};



export type ContentfulTag = {
  sys: {
    id: string;
    type: string;
    linkType: string; 
  };
  name: string;
};


type RichTextNode = {
  nodeType: string;
  content: Array<{
    nodeType: string;
    value?: string;
    content?: Array<RichTextNode>;
  }>;
};

export type ProjectEntry = {
  metadata: {
    tags: ContentfulTag[];
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

export type ProjectContent = {
  sys: {
    id: string;
    type: string;
  };
  fields: {
    id: string;
    project: ProjectEntry[];
  };
};

export type TextContent = {
  sys: {
    id: string;
    type: string;
  };
  fields: {
    id: string;
    textDanish: RichTextNode;
    textEnglish: RichTextNode;
  };
};

export type ContentItem = ProjectContent | TextContent;

export type HomeData = {
  title: string;
  slug: string;
  content: ContentItem[]; 
};