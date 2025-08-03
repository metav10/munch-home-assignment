import { VideoPlayer } from './components';

export const App = () => {
	return (
		<VideoPlayer
			video={'/videos/Norway.mp4'}
			width={400}
			thumbnailsImagesCount={5}
			loop
			muted
			autoPlay
		/>
	);
};
