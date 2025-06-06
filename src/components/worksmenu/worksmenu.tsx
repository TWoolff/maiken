import React, { useState, useEffect, useRef, useMemo } from 'react';
import { unstable_ViewTransition as ViewTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/services/context';
import { useTransition } from '@/services/transitionContext';
import { findEntryById } from '@/utils/content';
import { getLocalizedField } from '@/utils/localization';
import { PageData, ProjectEntry, ProjectContent } from '@/types/types';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import css from './worksmenu.module.css';
import { Key } from 'react';

const WorksMenu: React.FC = () => {
	const { state } = useAppContext();
	const language = state.language;
	const currentNav = state.currentNav;
	const navRef = useRef<HTMLElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const projectEntry = findEntryById(state.data as PageData[], currentNav, 'en-US');
	const router = useRouter();
	const { setTransitionImage, setTransitionBounds, setFinalBounds, setIsTransitioning, preloadedImages } = useTransition();

	const projects: ProjectEntry[] = useMemo(() => {
		if (projectEntry?.fields && 'project' in projectEntry.fields) {
			const entry = projectEntry as unknown as ProjectContent;
			return getLocalizedField(entry.fields.project, 'en-US') ?? [];
		}
		return [];
	}, [projectEntry]);

	const sortedProjects = useMemo(() => {
		return [...projects].sort((a, b) => {
			const yearA = Number(a.fields.year?.['en-US']) || 0;
			const yearB = Number(b.fields.year?.['en-US']) || 0;
			return yearB - yearA;
		});
	}, [projects]);

	const [hoveredProject, setHoveredProject] = useState<ProjectEntry | null>(null);

	useEffect(() => {
		if (projects.length > 0) {
			setHoveredProject(projects[0]);
		} else {
			setHoveredProject(null);
		}
	}, [projects]);

	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (navRef.current) {
				e.preventDefault();
				navRef.current.scrollLeft += e.deltaY * 2;
			}
		};

		const sectionElement = sectionRef.current;
		if (sectionElement) {
			sectionElement.addEventListener('wheel', handleWheel, { passive: false });
		}

		return () => {
			if (sectionElement) {
				sectionElement.removeEventListener('wheel', handleWheel);
			}
		};
	}, []);

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, mainImgUrl: string, projectSlug: string) => {
		e.preventDefault();

		if (!preloadedImages.has(mainImgUrl)) {
			return;
		}

		const imageUrl = preloadedImages.get(mainImgUrl)!;
		const element = e.currentTarget;
		const rect = element.getBoundingClientRect();

		// Prefetch the route to ensure it's ready
		router.prefetch(`/work/${projectSlug}`);

		window.scrollTo(0, 0);
		setTransitionBounds({
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height,
		});
		setTransitionImage(imageUrl);
		setIsTransitioning(true);

		// Wait for the animation to complete before navigating
		setTimeout(() => {
			router.push(`/work/${projectSlug}`);
		}, 800);
	};

	const handleMouseEnter = (project: ProjectEntry) => {
		setHoveredProject(project);
		const mainImgAsset = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US'] as any;

		if (mainImgAsset?.details?.image) {
			const windowWidth = window.innerWidth;
			const imageWidth = mainImgAsset.details.image.width;
			const imageHeight = mainImgAsset.details.image.height;
			const aspectRatio = imageHeight / imageWidth;
			const calculatedHeight = windowWidth * aspectRatio;

			setFinalBounds({
				top: 0,
				left: 0,
				width: windowWidth,
				height: calculatedHeight,
			});
		}

		// Prefetch the route on hover for faster navigation
		const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US');
		if (projectSlug) {
			router.prefetch(`/work/${projectSlug}`);
		}
	};

	useImagePreloader(sortedProjects);

	// Preload all project routes for faster navigation
	useEffect(() => {
		sortedProjects.forEach((project) => {
			const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US');
			if (projectSlug) {
				router.prefetch(`/work/${projectSlug}`);
			}
		});
	}, [sortedProjects, router]);

	return (
		<section ref={sectionRef} className={`${css.worksmenu} grid space`}>
			<nav ref={navRef}>
				{Array.isArray(projects) && projects.length > 0
					? sortedProjects.map((project: ProjectEntry, i: Key | null | undefined) => {
							const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US');
							const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url;

							if (!mainImgUrl || !preloadedImages.has(mainImgUrl)) {
								return null;
							}

							const preloadedSrc = preloadedImages.get(mainImgUrl);

							return (
								<Link
									href={`/work/${projectSlug}`}
									style={{
										backgroundImage: `url(${preloadedSrc})`,
										opacity: preloadedImages.has(mainImgUrl) ? 1 : 0,
									}}
									className={hoveredProject === project ? css.active : ''}
									onMouseEnter={() => handleMouseEnter(project)}
									onClick={(e) => projectSlug && handleClick(e, mainImgUrl, projectSlug)}
									key={i}
								>
									<ViewTransition name={`work-${projectSlug}`}>
										{preloadedSrc && (
											<Image
												src={preloadedSrc as string}
												alt={project.fields.title['en-US']}
												width={400}
												height={300}
												style={{
													objectFit: 'cover',
													opacity: preloadedImages.has(mainImgUrl) ? 1 : 0,
												}}
											/>
										)}
									</ViewTransition>
								</Link>
							);
					  })
					: null}
			</nav>
			<div className={css.projectInfo}>
				<h2>{getLocalizedField(hoveredProject?.fields?.title, language)}</h2>
			</div>

			<Link href={`work/${getLocalizedField(hoveredProject?.fields?.slug, 'en-US')}`} className={css.explore}>
				{language === 'da-DK' ? 'undersøg' : 'explore'}
			</Link>
			{hoveredProject && <p className={css.year}>{`WORK ${hoveredProject?.fields?.year?.['en-US'] ?? ''}`}</p>}
		</section>
	);
};

export default WorksMenu;
