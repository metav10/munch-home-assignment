import { useRef, type RefObject, useEffect } from 'react';
import {
  BAR_WRAPPER_WIDTH,
  PADDING_COUNT,
  TRIM_BAR_WIDTH,
} from './TrimBar.constants';
import { useTrimBarStyleDimensions } from './useTrimBarStyleDimensions';
import { useTrimBarDragging } from './useTrimBarDragging';

export const TrimBar = ({
	videoRef,
	trimStartTime,
	trimEndTime,
	setTrimStartTime,
	setTrimEndTime,
	videoDuration,
}: {
	videoRef: RefObject<HTMLVideoElement | null>;
	trimStartTime: number;
	trimEndTime: number;
	setTrimStartTime: (time: number) => void;
	setTrimEndTime: (time: number) => void;
	videoDuration: number;
}) => {
	const trimBarRef = useRef<HTMLDivElement>(null);

	const {
		trimBarWidth,
		trimBarBgSelectedEndWidthPercentage,
		trimBarBgSelectedStartWidthPercentage,
		startPositionPercentage,
		endPositionPercentage,
	} = useTrimBarStyleDimensions({
		videoRef,
		trimBarRef,
		trimStartTime,
		trimEndTime,
	});

	const {
		isDraggingTrimStart,
		isDraggingTrimEnd,
		handleTrimStartDragStart,
		handleTrimStartDragMove,
		handleTrimEndDragMove,
		handleTrimEndDragStart,
		handleMouseUp,
	} = useTrimBarDragging({
		trimBarRef,
		trimBarWidth,
		videoDuration,
		setTrimStartTime,
		setTrimEndTime,
	});

	// save trim actions
	useEffect(() => {
		if (isDraggingTrimStart) {
			videoRef.current!.currentTime = trimStartTime;
		}
	}, [trimStartTime, videoRef, isDraggingTrimStart]);

	useEffect(() => {
		if (isDraggingTrimEnd) {
			videoRef.current!.currentTime = trimEndTime;
			videoRef.current!.pause();
		}
	}, [trimEndTime, videoRef, isDraggingTrimEnd]);

	return (
		<div
			ref={trimBarRef}
			style={{
				display: 'flex',
				width: '100%',
				height: '100%',
				position: 'absolute',
				top: 0,
				left: 0,
			}}>
			<span
				style={{
					width: `${BAR_WRAPPER_WIDTH}px`,
					height: '100%',
					position: 'absolute',
					top: 0,
					left: `calc(${startPositionPercentage}% - ${
						PADDING_COUNT * TRIM_BAR_WIDTH
					}px)`,
				}}
				onMouseDown={handleTrimStartDragStart}
				onMouseMove={handleTrimStartDragMove}
				onMouseUp={handleMouseUp}>
				<span
					style={{
						width: `${TRIM_BAR_WIDTH}px`,
						height: '100%',
						backgroundColor: 'red',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						margin: '0 auto',
						zIndex: 2,
						transform: `translateX(-${TRIM_BAR_WIDTH}px)`,
					}}
				/>
				<span
					style={{
						width: `${trimBarBgSelectedStartWidthPercentage}px`,
						height: '100%',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						position: 'absolute',
						right: `calc(100% - ${
							PADDING_COUNT * TRIM_BAR_WIDTH
						}px)`,
						zIndex: 1,
					}}
				/>
			</span>
			<span
				style={{
					width: `${BAR_WRAPPER_WIDTH}px`,
					height: '100%',
					position: 'absolute',
					top: 0,
					right: `calc(${100 - endPositionPercentage}% - ${
						PADDING_COUNT * TRIM_BAR_WIDTH
					}px)`,
				}}
				onMouseDown={handleTrimEndDragStart}
				onMouseMove={handleTrimEndDragMove}
				onMouseUp={handleMouseUp}>
				<span
					style={{
						width: `${TRIM_BAR_WIDTH}px`,
						height: '100%',
						backgroundColor: 'red',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						margin: '0 auto',
						zIndex: 2,
						transform: `translateX(${TRIM_BAR_WIDTH}px)`,
					}}
				/>
				<span
					style={{
						width: `${trimBarBgSelectedEndWidthPercentage}px`,
						height: '100%',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						position: 'absolute',
						left: `calc(100% - ${
							PADDING_COUNT * TRIM_BAR_WIDTH
						}px)`,
						zIndex: 1,
					}}
				/>
			</span>
		</div>
	);
};
