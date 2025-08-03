import { useState, type RefObject, useEffect } from 'react';

export const useTrimBarStyleDimensions = ({
	videoRef,
	trimBarRef,
	trimStartTime,
	trimEndTime,
}: {
	videoRef: RefObject<HTMLVideoElement | null>;
	trimBarRef: RefObject<HTMLDivElement | null>;
	trimStartTime: number;
	trimEndTime: number;
}) => {
	const [trimBarWidth, setTrimBarWidth] = useState<number>(0);

	useEffect(() => {
		if (trimBarRef.current) {
			setTrimBarWidth(trimBarRef.current.clientWidth);
		}
	}, [trimBarRef]);

	const videoDuration = videoRef.current?.duration || 0;

	// trim positions in percentage
	const startPositionPercentage =
		(trimStartTime / (videoDuration || 0)) * 100;
	const endPositionPercentage = (trimEndTime / (videoDuration || 0)) * 100;

	// trim bar background selected width in pixels
	const trimBarBgSelectedEndWidthPercentage =
		(trimBarWidth * (100 - endPositionPercentage)) / 100;

	const trimBarBgSelectedStartWidthPercentage =
		(trimBarWidth * startPositionPercentage) / 100;

	return {
		trimBarWidth,
		trimBarBgSelectedEndWidthPercentage,
		trimBarBgSelectedStartWidthPercentage,
		startPositionPercentage,
		endPositionPercentage,
	};
};
