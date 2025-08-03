import {
	useEffect,
	useRef,
	useState,
	type DetailedHTMLProps,
	type VideoHTMLAttributes,
} from 'react';
import { TrimBar } from './trimBar';
import { Timeline } from './timeline/Timeline';

type VideoElementProps = DetailedHTMLProps<
	VideoHTMLAttributes<HTMLVideoElement>,
	HTMLVideoElement
>;

export const VideoPlayer = ({
	video,
	width,
	height,
	thumbnailsImagesCount = 5,
	controls = true,
	autoPlay = false,
	muted = true,
	loop = false,
	...videoProps
}: {
	video: string;
	width?: number;
	height?: number;
	thumbnailsImagesCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
} & Omit<VideoElementProps, 'src' | 'width' | 'height'>) => {
	// videoRef is the original video element, we don't want to do any manipulation on it
	const videoRef = useRef<HTMLVideoElement>(null);

	// currentVideoRef is the video element that is currently being used
	const currentVideoRef = useRef<HTMLVideoElement>(null);

	// isTrimming is the state of the toggle trimming button
	const [isTrimming, setIsTrimming] = useState<boolean>(false);

	// videoWidth is the width of the video for the timeline
	const [videoWidth, setVideoWidth] = useState<number>(0);

	// videoDuration is the duration of the video
	const videoDuration = currentVideoRef.current?.duration || 0;

	// trim start and end times
	const [trimStartTime, setTrimStartTime] = useState<number>(0);
	const [trimEndTime, setTrimEndTime] = useState<number>(0);

	useEffect(() => {
		setTrimEndTime(videoDuration);
	}, [videoDuration]);

	// set videoRef into currentVideoRef
	useEffect(() => {
		if (videoRef.current) {
			currentVideoRef.current = videoRef.current.cloneNode(
				true
			) as HTMLVideoElement;
		}
	}, [videoRef]);

	useEffect(() => {
		setVideoWidth(currentVideoRef.current?.width || 0);
	}, [currentVideoRef]);

	useEffect(() => {
		const stopAt = () => {
			if (currentVideoRef.current!.currentTime >= trimEndTime) {
				if (currentVideoRef.current!.currentTime > trimEndTime) {
					currentVideoRef.current!.currentTime = trimEndTime;
				}

				currentVideoRef.current!.pause();
				currentVideoRef.current?.removeEventListener(
					'timeupdate',
					stopAt
				);
			} else if (currentVideoRef.current!.currentTime < trimStartTime) {
				currentVideoRef.current!.currentTime = trimStartTime;
				currentVideoRef.current!.play();
			}
		};

		currentVideoRef.current?.addEventListener('timeupdate', stopAt);
	}, [currentVideoRef, trimEndTime, trimStartTime]);

	const handleStartTrimming = () => {
		setIsTrimming((prev) => !prev);
	};

	const handleSaveTrimming = () => {
		setIsTrimming(false);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
				alignItems: 'center',
			}}>
			<div>
				<video
					ref={currentVideoRef}
					src={video}
					width={width}
					height={height}
					controls={controls}
					autoPlay={autoPlay}
					muted={muted}
					loop={loop}
					{...videoProps}>
					Your browser does not support the video tag.
				</video>
			</div>

			<div
				style={{
					display: 'flex',
					position: 'relative',
					width: videoWidth,
				}}>
				<Timeline
					videoRef={currentVideoRef}
					thumbnailsImagesCount={thumbnailsImagesCount}
				/>
				{isTrimming && (
					<TrimBar
						videoRef={currentVideoRef}
						trimStartTime={trimStartTime}
						trimEndTime={trimEndTime}
						setTrimStartTime={setTrimStartTime}
						setTrimEndTime={setTrimEndTime}
						videoDuration={videoDuration}
					/>
				)}
			</div>

			<button
				onClick={isTrimming ? handleSaveTrimming : handleStartTrimming}>
				{isTrimming ? 'End Trimming' : 'Start Trimming'}
			</button>
		</div>
	);
};
