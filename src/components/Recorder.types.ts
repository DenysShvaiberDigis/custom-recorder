export type RecorderProps = {
  recordTime?: number;
  setRecordedChunks: (chunks: Blob[]) => void;
  recordedVid: string;
  setRecordedVid: (videoURL: string) => void;
  capturing: boolean;
  setCapturing: (capturing: boolean) => void;
  hasStartedRecording: boolean;
  setStartedRecording: (started: boolean) => void;
  setIsError: (error: boolean) => void;
};

export type HTMLMediaElementWithCaptureStream = HTMLMediaElement & {
  captureStream(): MediaStream;
  mozCaptureStream(): MediaStream;
};