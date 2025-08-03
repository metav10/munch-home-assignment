import { useState, type MouseEvent, type RefObject } from 'react';
import { TRIM_BAR_WIDTH } from './TrimBar.constants';

export const useTrimBarDragging = ({
	trimBarRef,
	trimBarWidth,
	videoDuration,
	setTrimStartTime,
	setTrimEndTime,
}: {
	trimBarRef: RefObject<HTMLDivElement | null>;
	trimBarWidth: number;
	videoDuration: number;
	setTrimStartTime: (time: number) => void;
	setTrimEndTime: (time: number) => void;
}) => {
	// DRAGGING
	// dragging states
	const [isDraggingTrimStart, setIsDraggingTrimStart] = useState<boolean>(false);
	const [isDraggingTrimEnd, setIsDraggingTrimEnd] = useState<boolean>(false);

	// handle trim start drag start
	const handleTrimStartDragStart = () => {
		setIsDraggingTrimStart(true);
	};

	const handleTrimStartDragMove = (e: MouseEvent<HTMLSpanElement>) => {
		if (!isDraggingTrimStart) return;

		const currentMouseLeftPos = e.clientX;
		const trimBarLeftPos = trimBarRef.current!.getBoundingClientRect().left;

		let diffInPx =
			currentMouseLeftPos -
			trimBarLeftPos -
			TRIM_BAR_WIDTH +
			TRIM_BAR_WIDTH / 2;

		if (diffInPx < 0) {
			diffInPx = 0;
		}

		const percentage = diffInPx / trimBarWidth;
		setTrimStartTime(percentage * videoDuration);
	};

	// handle trim end drag move
	const handleTrimEndDragMove = (e: MouseEvent<HTMLSpanElement>) => {
		if (!isDraggingTrimEnd) return;
		const currentMouseLeftPos = e.clientX;
		const trimBarRightPos =
			trimBarRef.current!.getBoundingClientRect().right;

		let diffInPx =
			trimBarRightPos -
			currentMouseLeftPos -
			TRIM_BAR_WIDTH +
			TRIM_BAR_WIDTH / 2;

		if (diffInPx < 0) {
			diffInPx = 0;
		}

		const percentage = diffInPx / trimBarWidth;

		setTrimEndTime((1 - percentage) * videoDuration);
	};

	const handleTrimEndDragStart = () => {
		setIsDraggingTrimEnd(true);
	};

	// handle drag end
	const handleMouseUp = () => {
		setIsDraggingTrimStart(false);
		setIsDraggingTrimEnd(false);
	};

	return {
		isDraggingTrimStart,
		isDraggingTrimEnd,
		handleTrimStartDragStart,
		handleTrimStartDragMove,
		handleTrimEndDragMove,
		handleTrimEndDragStart,
		handleMouseUp,
	};
};
