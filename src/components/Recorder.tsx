import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import {
  ONE_SECOND_IN_MS,
  RECORD_TIME,
  VIDEO_CONSTRAINS,
} from '../constants/constants';
import { HTMLMediaElementWithCaptureStream, RecorderProps } from './Recorder.types';
import styles from './Recorder.module.scss';

export const Recorder: React.FC<RecorderProps> = ({
  recordTime = RECORD_TIME,
  setRecordedChunks,
  recordedVid,
  setRecordedVid,
  capturing,
  setCapturing,
  recordingTimeMS,
  setRecordingTimeMS,
  hasStartedRecording,
  setStartedRecording,
  setIsError,
}) => {
  const webcamRef = useRef<HTMLMediaElementWithCaptureStream>(null);

  const [counter, setCounter] = useState(recordTime);

  const hasTwoSecondsPassed = recordTime - 2000 >= recordingTimeMS;

  useEffect(() => {
    if (capturing) {
      const interval: ReturnType<typeof setInterval> | null = setInterval(
        () => {
          setCounter((prevCounter) => {
            if (prevCounter <= 0) {
              setRecordingTimeMS(0);
              return prevCounter;
            }
            const newCounter = prevCounter - ONE_SECOND_IN_MS;
            setRecordingTimeMS(newCounter);
            return newCounter;
          });
        },
        ONE_SECOND_IN_MS
      );

      return () => {
        if (interval) {
          clearInterval(interval);
        }

        stopVideoHandler();
      };
    }
  }, [capturing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (recordingTimeMS <= 0) {
      stopVideoHandler();
    }
  }, [recordingTimeMS]); // eslint-disable-line react-hooks/exhaustive-deps

  const startRecording = async (stream: MediaStream, lengthInMS: number) => {
    try {
      setCapturing(true);
      setRecordingTimeMS(recordTime);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      const data: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => data.push(event.data);
      mediaRecorder.onstop = () => {
        setRecordedChunks(data);
        const recordedBlob = new Blob(data, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(recordedBlob);
        setRecordedVid(videoURL);
        setCounter(recordingTimeMS);
      };
      mediaRecorder.onerror = (event: Event) =>
        console.error('MediaRecorder error:', event);

      mediaRecorder.start();

      const recorded = wait(lengthInMS).then(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      });

      await recorded;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  const stopRecording = (stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const wait = (delayInMS: number) => {
    return new Promise<void>((resolve) => setTimeout(resolve, delayInMS));
  };

  const recordVideoHandler = async () => {
    try {
      setStartedRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: VIDEO_CONSTRAINS,
        audio: true,
      });

      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.captureStream =
          webcamRef.current.captureStream || webcamRef.current.mozCaptureStream;
      }

      await new Promise<void>((resolve) => {
        if (webcamRef.current) {
          webcamRef.current.onplaying = () => resolve();
        }
      });

      if (webcamRef.current) {
        await startRecording(
          webcamRef.current.captureStream(),
          recordingTimeMS
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Permission denied')) {
          setIsError(true);
        } else {
          console.error(error);
        }
      }
    }
  };

  const stopVideoHandler = () => {
    stopRecording(webcamRef.current?.srcObject as MediaStream);
    setCapturing(false);
    setRecordingTimeMS(0);
  };

  return (
    <Box className={styles.mainWrapper}>
      <div className={styles.videoContainer}>
        <div
          className={styles.recordedVid}
          style={
            recordedVid && !capturing
              ? { zIndex: 100 }
              : { visibility: 'hidden' }
          }
        >
          <video src={recordedVid} controls controlsList="nodownload"></video>
        </div>
        <div className={styles.recordedVid}>
          <video
            ref={webcamRef as unknown as React.RefObject<HTMLVideoElement>}
            autoPlay
            muted
          ></video>
        </div>

        <div className={styles.recordHandlerBlock}>
          {capturing && webcamRef.current?.onplaying && hasTwoSecondsPassed && (
            <>
              <div
                className={styles.recordCircleWrapper}
                onClick={stopVideoHandler}
              >
                <div
                  className={`${styles.recordIndicator} ${styles.squared}`}
                ></div>
              </div>
              <div
                className={styles.recordBtnRectangle}
                onClick={stopVideoHandler}
              >
                <div className={styles.recordIcon}>
                  <span />
                </div>
                <Typography variant="body1">
                  -{moment.utc(counter).format('mm:ss')}
                </Typography>
              </div>
            </>
          )}

          {!webcamRef.current?.onplaying &&
            !hasTwoSecondsPassed &&
            hasStartedRecording &&
            !capturing && (
              <Box sx={{ position: 'absolute', bottom: ' 75px' }}>
                <CircularProgress />
              </Box>
            )}

          {!capturing && !hasStartedRecording && (
            <>
              <div
                className={styles.recordCircleWrapper}
                onClick={recordVideoHandler}
              >
                <div
                  className={`${styles.recordIndicator} ${styles.rounded}`}
                ></div>
              </div>
              <div
                className={styles.recordBtnRectangle}
                onClick={recordVideoHandler}
              >
                Start Recording
              </div>
            </>
          )}
        </div>
      </div>
    </Box>
  );
};
