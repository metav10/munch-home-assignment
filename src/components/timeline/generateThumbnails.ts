const seekTo = (video: HTMLVideoElement, time: number): Promise<void> => {
	return new Promise((resolve) => {
		const handler = () => {
			video.removeEventListener('seeked', handler);
			resolve();
		};
		video.addEventListener('seeked', handler);
		video.currentTime = time;
	});
};

// running through the video and generating thumbnails at by the thumbnailsImagesCount
export const generateThumbnails = async (
	video: HTMLVideoElement,
	thumbnailsImagesCount: number
): Promise<string[] | undefined> => {
	if (!video) return;

	await new Promise<void>((resolve) => {
		if (video.readyState >= 1) {
			resolve();
		} else {
			video.addEventListener('loadedmetadata', () => resolve(), {
				once: true,
			});
		}
	});

	const duration = video.duration;
	const interval = duration / thumbnailsImagesCount; // seconds
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const results: string[] = [];

	for (let t = 0; t < duration; t += interval) {
		await seekTo(video, t);

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		const img = canvas.toDataURL('image/jpeg');
		results.push(img);
	}

	return results;
};
