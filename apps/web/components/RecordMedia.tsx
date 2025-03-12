import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Video from "./Video";
import { toast } from "sonner";

/**
 * Record Media Component
 * @param handleVideoUpload - Function to handle video upload
 * @returns Record Media Component
 */
export default function RecordMedia({ handleVideoUpload } : { handleVideoUpload : (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false);

  // Recorded video url
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [permissions, setPermissions] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);


  /** Setup Camera Fn */
  const setupCamera = useCallback(async () : Promise<MediaStream | null> => {
    if("MediaRecorder" in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setPermissions(true);
        return stream;
      } catch (error : unknown) {
        if(error instanceof Error) {
          toast(`${error.message}, please enable camera and audio permissions`);
        } else {
          toast("Unknown error, please enable camera and audio permissions");
        }
        setPermissions(false);
        return null;
      }
    } else {
      toast("MediaRecorder is not supported in your browser");
      setPermissions(false);
      return null;
    }
  }, []);

  /** Recording Video Fn */
  const handleRecordingStart = useCallback(async() => {
    chunksRef.current = [];
    const stream = await setupCamera();
    if (!stream) return;

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9,opus",
      });

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (typeof e.data === "undefined") return;
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm; codecs=vp9,opus" });
        const videoURL = URL.createObjectURL(blob);
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        setRecordedVideo(videoURL);
        setRecordedBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      if(error instanceof Error) {
        toast(`${error.message}, Error occured while recording video`);
      } else {
        toast("Something went wrong");
      }
    }
  },[setupCamera]);

  const handleRecordingStop = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedBlob(null);
    setRecordedVideo(null);
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo);
      }
    };
  }, [recordedVideo]);

  return (
    <div>
      {recordedVideo ? (
        <div>
            <Video
              src={recordedVideo}
            >
            </Video>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 bg-black rounded-xl"
          />
          {!permissions && !isRecording && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white bg-black bg-opacity-50 p-2 rounded">
                Click on Record Yourself to enable camera
              </p>
            </div>
          )}
        </div>
      )}

      {!isRecording && !recordedVideo && (
        <Button
          onClick={handleRecordingStart}
          className="w-full mt-3 rounded-full"
        >
          Record Yourself
        </Button>
      )}

      {isRecording && (
        <Button onClick={handleRecordingStop} className="w-full mt-3 rounded-full">Stop recording</Button>
      )}

      {recordedVideo && (
        <>
          <div className="mt-3 flex gap-2">
            <button
              onClick={resetRecording}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Record Again
            </button>
            <button
              onClick={() => handleVideoUpload(recordedBlob as Blob)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Use This Video
            </button>
          </div>
        </>
      )}
    </div>
  );
}
