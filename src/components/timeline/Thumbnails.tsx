import { useEffect, type RefObject } from 'react';
import { generateThumbnails } from './generateThumbnails';

export const Thumbnails = ({
	videoRef,
	setThumbnails,
	thumbnails,
	thumbnailsImagesCount,
}: {
	videoRef: RefObject<HTMLVideoElement | null>;
	thumbnails: string[];
	setThumbnails: (thumbnails: string[]) => void;
	thumbnailsImagesCount: number;
}) => {
	useEffect(() => {
		const generate = async () => {
			const video = videoRef.current;
			if (!video) return;

			const thumbnails = await generateThumbnails(
				video,
				thumbnailsImagesCount
			);
			if (thumbnails) {
				setThumbnails(thumbnails);
			}
		};
		generate();
	}, [videoRef, setThumbnails, thumbnailsImagesCount]);

	return (
		<div
			style={{
				display: 'flex',
				height: '100px',
				width: '100%',
				pointerEvents: 'none',
			}}>
			{thumbnails.map((thumb, i) => (
				<img
					key={i}
					src={thumb}
					alt={`Thumbnail ${i}`}
					style={{
						objectFit: 'cover',
						objectPosition: 'top',
						flex: 1,
						maxWidth: `calc(100% / ${thumbnailsImagesCount})`,
					}}
				/>
			))}
		</div>
	);
};
