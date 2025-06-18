import { useRef, useEffect } from 'react';
import { VideoEntry } from '@/types/types';
import css from './content.module.css';

interface VideoContentProps {
	content: VideoEntry;
}

const VideoContent = ({ content }: VideoContentProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const videoUrl = content.fields.video['en-US']?.fields?.file?.['en-US']?.url;
	const videoType = content.fields.video['en-US']?.fields?.file?.['en-US']?.contentType;

	useEffect(() => {
		const videoElement = videoRef.current;
		if (!videoElement) return;

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.5,
		};

		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					videoElement.play().catch((error) => {
						console.log('Video play failed:', error);
					});
				} else {
					videoElement.pause();
				}
			});
		};

		observerRef.current = new IntersectionObserver(handleIntersection, options);
		observerRef.current.observe(videoElement);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	if (!videoUrl) return null;

	return (
		<article className={css.videoContainer}>
			<video ref={videoRef} loop muted playsInline className={css.contentVideo}>
				<source src={`https:${videoUrl}`} type={videoType} />
				Your browser does not support the video tag.
			</video>
		</article>
	);
};

export default VideoContent;
