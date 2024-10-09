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

export type LocalizedFields<T> = {
  [locale: string]: T;
};

export type RichTextDocument = {
  nodeType: string;
  data: object;
  content: Array<{
    nodeType: string;
    data: object;
    content: Array<{
      nodeType: string;
      value?: string;
      data: object;
    }>;
  }>;
};

export type TextContent = {
  sys: {
    id: string;
    type: string;
  };
  fields: {
    id: LocalizedFields<string>;
    text: LocalizedFields<RichTextDocument>;
  };
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
    title: LocalizedFields<string>;
    year: LocalizedFields<number>;
    slug: LocalizedFields<string>;
    content: LocalizedFields<RichTextDocument[]>;
  };
};

export type ProjectContent = {
  sys: {
    id: string;
    type: string;
  };
  fields: {
    id: LocalizedFields<string>;
    project: LocalizedFields<ProjectEntry[]>;
  };
};

export type ContentItem = ProjectContent | TextContent;

export type HomeData = {
  title: LocalizedFields<string>;
  slug: LocalizedFields<string>;
  content: LocalizedFields<ContentItem[]>;
};

export type ContentfulDocument = {
  content: { content: { value: string }[] }[]
} | undefined