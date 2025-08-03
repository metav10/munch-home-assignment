import { useEffect, useState, type RefObject } from 'react';
import { Thumbnails } from './Thumbnails';

export const Timeline = ({
	videoRef,
	thumbnailsImagesCount,
}: {
	videoRef: RefObject<HTMLVideoElement | null>;
	thumbnailsImagesCount: number;
}) => {
	const [thumbnails, setThumbnails] = useState<string[]>([]);
	const [currentTime, setCurrentTime] = useState<number>(0);

	useEffect(() => {
		if (!videoRef.current) return;
		videoRef.current.addEventListener('timeupdate', () => {
			setCurrentTime(videoRef.current?.currentTime || 0);
		});
	}, [videoRef]);

	const currentTimePercentage =
		currentTime / (videoRef?.current?.duration || 0) || 0;

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const { left, width } = e.currentTarget.getBoundingClientRect();
		const clickX = e.clientX - left;
		const percentage = clickX / width;
		const time = percentage * (videoRef?.current?.duration || 0);
		videoRef.current!.currentTime = time;
	};

	return (
		<div
			style={{
				display: 'flex',
				height: '100px',
				width: '100%',
				position: 'relative',
			}}>
			<Thumbnails
				videoRef={videoRef}
				thumbnails={thumbnails}
				setThumbnails={setThumbnails}
				thumbnailsImagesCount={thumbnailsImagesCount}
			/>
			{thumbnails && (
				<div
					style={{
						display: 'flex',
						height: '100%',
						width: '100%',
						position: 'absolute',
						top: -5,
						left: 0,
					}}
					onClick={handleClick}>
					<span
						style={{
							width: `${currentTimePercentage * 100}%`,
							height: 'calc(100% + 10px)',
							borderRight: '2px solid red',
						}}
					/>
					<span
						style={{
							position: 'absolute',
							top: -5,
							left: `calc(${currentTimePercentage * 100}% + 1px)`,
							transform: 'translateX(-50%)',
							width: 0,
							height: 0,
							borderLeft: '6px solid transparent',
							borderRight: '6px solid transparent',
							borderTop: '6px solid red',
						}}
					/>
				</div>
			)}
		</div>
	);
};
