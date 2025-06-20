'use client';
import { use, useEffect, useState, useRef } from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react';
import Image from 'next/image';
import { findEntryBySlug } from '@/services/contentful';
import { useAppContext } from '@/services/context';
import { useTransition } from '@/services/transitionContext';
import { getLocalizedField } from '@/utils/localization';
import { ImageEntry, ProjectEntry, TextContentEntry, VideoEntry, ImageDoubleEntry } from '@/types/types';
import TextContent from '@/components/content/TextContent';
import ImageContent from '@/components/content/ImageContent';
import VideoContent from '@/components/content/VideoContent';
import ImageDoubleContent from '@/components/content/ImageDoubleContent';
import css from './project.module.css';

interface PageProps {
	params: Promise<{ projectSlug: string }>;
}

const ProjectPage = ({ params }: PageProps) => {
	const { state } = useAppContext();
	const { transitionImage, isTransitioning, preloadedImages } = useTransition();
	const language = state.language;
	const [project, setProject] = useState<ProjectEntry | null>(null);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [titleZIndex, setTitleZIndex] = useState(100);
	const svgRef = useRef<SVGSVGElement>(null);
	const textRef = useRef<SVGTextElement>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const projectSlug = use(params).projectSlug;

	useEffect(() => {
		const fetchProject = async () => {
			const projectData = await findEntryBySlug(projectSlug);
			setProject(projectData);
		};

		fetchProject();
	}, [projectSlug]);

	console.log(project);

	// Preload the main image to prevent blinking
	useEffect(() => {
		if (project) {
			const mainImgUrl = project.fields.mainImg?.['en-US'].fields.file?.['en-US'].url;
			if (mainImgUrl) {
				const imageUrl = preloadedImages.get(mainImgUrl) || `https:${mainImgUrl}`;
				const img = document.createElement('img');
				img.onload = () => setImageLoaded(true);
				img.src = imageUrl;
			}
		}
	}, [project, preloadedImages]);

	useEffect(() => {
		const adjustTextSize = () => {
			if (svgRef.current && textRef.current) {
				const isMobile = window.innerWidth < 768;
				const padding = isMobile ? `${1.5}rem` : `${3}rem`;

				const remToPx = (rem: string) => {
					const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
					return parseFloat(rem) * baseFontSize;
				};

				const paddingPx = remToPx(padding) * 2;
				const svgWidth = svgRef.current.clientWidth - paddingPx;
				const textWidth = textRef.current.getBBox().width;
				const scale = (svgWidth / textWidth) * 1;

				textRef.current.style.transform = `scale(${scale})`;
			}
		};

		if (project) {
			// Use requestAnimationFrame to ensure DOM is ready for text scaling
			requestAnimationFrame(() => {
				adjustTextSize();
			});
			window.addEventListener('resize', adjustTextSize);
		}

		return () => {
			window.removeEventListener('resize', adjustTextSize);
		};
	}, [project]);

	useEffect(() => {
		if (isTransitioning) {
			document.body.style.overflow = 'hidden';
			window.scrollTo({ top: 0, behavior: 'instant' });
		} else {
			setTimeout(() => {
				window.scrollTo({ top: 0, behavior: 'instant' });
				document.body.style.overflow = '';
			}, 100);
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [isTransitioning]);

	// Dynamic z-index control for title based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			if (contentContainerRef.current) {
				const contentRect = contentContainerRef.current.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				const titlePosition = viewportHeight / 2; // Title is centered vertically

				// If title overlaps with content area, put it behind content
				// If title is only over main image area, put it above main image
				if (contentRect.top < titlePosition && contentRect.bottom > titlePosition) {
					// Title is overlapping with content - put behind content
					setTitleZIndex(-1);
				} else {
					// Title is only over main image - put above main image but below content
					setTitleZIndex(100);
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial check

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [project]);

	if (!project) return null;
	const title = getLocalizedField(project.fields.title, language) as string;
	const contentEntries = (project.fields.content?.['en-US'] || []) as unknown as (
		| ProjectEntry
		| ImageEntry
		| TextContentEntry
		| VideoEntry
		| ImageDoubleEntry
	)[];

	const mainImgUrl = project.fields.mainImg?.['en-US'].fields.file?.['en-US'].url;

	const isImageDoubleEntry = (entry: any): entry is ImageDoubleEntry => {
		return (
			'fields' in entry &&
			'imageLeft' in entry.fields &&
			'imageRight' in entry.fields &&
			'spacing' in entry.fields &&
			entry.sys.contentType.sys.id === 'imageDouble'
		);
	};

	const renderContent = (entry: ProjectEntry | ImageEntry | TextContentEntry | VideoEntry | ImageDoubleEntry, index: number) => {
		if (!('sys' in entry) || !('contentType' in entry.sys)) return null;

		const contentType = entry.sys.contentType.sys.id;

		switch (contentType) {
			case 'text':
				return <TextContent key={index} content={entry as TextContentEntry} language={language} />;
			case 'image':
				return <ImageContent key={index} content={entry as ImageEntry} />;
			case 'imageDouble':
				if (isImageDoubleEntry(entry)) {
					return <ImageDoubleContent key={index} content={entry} />;
				}
				return null;
			case 'video':
				return <VideoContent key={index} content={entry as VideoEntry} />;
			default:
				return null;
		}
	};

	return (
		<>
			<section className={`${css.project} grid`}>
				{mainImgUrl && (
					<ViewTransition name={`work-${projectSlug}`}>
						{imageLoaded ? (
							<Image
								key={mainImgUrl}
								src={preloadedImages.get(mainImgUrl) || `https:${mainImgUrl}`}
								alt={title}
								className={css.mainImg}
								width={800}
								height={600}
								priority={true}
								loading='eager'
								style={{
									position: transitionImage ? 'absolute' : 'relative',
									visibility: transitionImage ? 'hidden' : 'visible',
									top: 0,
									left: 0,
								}}
							/>
						) : (
							<div
								className={css.mainImg}
								style={{
									backgroundColor: '#f0f0f0',
									position: transitionImage ? 'absolute' : 'relative',
									visibility: transitionImage ? 'hidden' : 'visible',
									top: 0,
									left: 0,
									width: '100vw',
									height: '60vh',
								}}
							/>
						)}
					</ViewTransition>
				)}
				<div ref={contentContainerRef} className={css.contentContainer}>
					{contentEntries.length === 0
						? null
						: contentEntries.map((entry: ProjectEntry | ImageEntry | TextContentEntry | VideoEntry | ImageDoubleEntry, i: number) => renderContent(entry, i))}
				</div>
			</section>
			<div className={css.titleContainer} style={{ zIndex: titleZIndex }}>
				<svg ref={svgRef} width='100%' height='100%' preserveAspectRatio='xMidYMid meet'>
					<text ref={textRef} x='50%' y='50%' dominantBaseline='middle' textAnchor='middle' className={css.titleText}>
						{title}
					</text>
				</svg>
			</div>
		</>
	);
};

export default ProjectPage;
