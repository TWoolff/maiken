'use client';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/services/context';
import { getPage } from '@/services/contentful';
import { getLocalizedField } from '@/utils/localization';
import { PageData, RichTextDocument, ContentEntry } from '@/types/types';
import Loader from '@/components/loader/loader';
import css from './about.module.css';

const About: React.FC = () => {
	const { state } = useAppContext();
	const [aboutData, setAboutData] = useState<PageData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const language = state.language;

	useEffect(() => {
		let aboutPageData = Array.isArray(state.data) ? state.data.find((page: PageData) => page.fields?.slug?.['en-US'] === 'about') : null;

		if (aboutPageData) {
			setAboutData(aboutPageData);
			setLoading(false);
		} else {
			const fetchData = async () => {
				setLoading(true);
				try {
					const page = await getPage('about');
					if (page && page.items && page.items.length > 0) {
						aboutPageData = page.items[0] as PageData;
						setAboutData(aboutPageData);
					}
				} catch (err) {
					setError('Error fetching about page data');
					console.error(err);
				} finally {
					setLoading(false);
				}
			};
			fetchData();
		}
	}, [state.data]);

	if (loading) return <Loader />;
	if (error) return null;
	if (!aboutData) return null;

	const title: string = getLocalizedField(aboutData.fields?.title, language) as string;
	const contentArray = aboutData.fields?.content?.['en-US'] || [];

	return (
		<section className={`${css.about} grid space`}>
			<h1>{title}</h1>
			{contentArray.length > 0
				? contentArray.map((entry: ContentEntry, i: number) => {
						if (entry.fields?.text) {
							const textContent: RichTextDocument | null = getLocalizedField(entry.fields.text, language);
							return (
								<div className={css.content} key={i}>
									{textContent?.content.map((paragraph, i) => (
										<p key={i}>{paragraph.content.map((textNode) => textNode.value).join(' ')}</p>
									))}
								</div>
							);
						}
						return null;
				  })
				: null}
		</section>
	);
};

export default About;
