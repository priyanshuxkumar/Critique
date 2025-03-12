interface VideoProps {
  src: string;
}

/**
 * Video Component for displaying recorded video content
 * @param {string} props.src - Source URL of the video (supports webm format)
 * @example
 * <Video src="blob:http://localhost:3000/video-123" />
 */

export default function Video({ src }: VideoProps) {
  return (
    <video
      className="w-full h-64 bg-black rounded-xl"
      autoPlay
      controls
      playsInline
      muted={false}
    >
      <source src={src} type="video/webm; codecs=vp9,opus" />
      Your browser does not support the video.
    </video>
  );
}
