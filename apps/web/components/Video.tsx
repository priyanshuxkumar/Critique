/**
 * Video Component for displaying recorded video content
 * @param {Object} props - Component props
 * @param {string} props.src - Source URL of the video (supports webm format)
 * @returns {JSX.Element} A video player component
 * @example
 * <Video src="blob:http://localhost:3000/video-123" />
 */
export default function Video({ src } : {src : string}) {
  return (
    <video className="w-full h-64 bg-black rounded-xl" width="50" height="50" autoPlay>
      <source
        src={src}
        type="video/webm"
      />
      Your browser does not support the video.
    </video>
  );
}
