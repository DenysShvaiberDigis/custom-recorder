import { useState } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';

import { Recorder } from './components/Recorder';
import { RECORD_TIME } from './constants/constants';

export const App = () => {
  const [hasStartedRecording, setStartedRecording] = useState<boolean>(false);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVid, setRecordedVid] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const [recordingTimeMS, setRecordingTimeMS] = useState(RECORD_TIME); // 1 minute

  const startUploadingVideo = () => {
    const formData = new FormData();
    formData.append('file', recordedChunks[0]);

    if (formData) {
      // send form data on the server
      console.log(`recordedChunks >>>`, recordedChunks);
      console.log(`recordedVid >>>`, recordedVid);
    }
  };

  const recordNewVideoHandler = () => {
    setRecordedChunks([]);
    setRecordedVid('');
    setStartedRecording(false);
    setRecordingTimeMS(RECORD_TIME);
  };

  const errorModalCloseHandler = () => {
    setIsError(false);
    setStartedRecording(false);
  };

  return (
    <Box>
      <Typography
        variant="h3"
        sx={{
          textTransform: 'initial',
          maxWidth: '70%',
          textAlign: 'center',
          margin: '56px auto 0',
        }}
      >
        Click on the record button to record a 1-minute introduction video
      </Typography>

      <Recorder
        recordingTimeMS={recordingTimeMS}
        setRecordingTimeMS={setRecordingTimeMS}
        recordTime={RECORD_TIME}
        capturing={capturing}
        setCapturing={setCapturing}
        setRecordedChunks={setRecordedChunks}
        recordedVid={recordedVid}
        setRecordedVid={setRecordedVid}
        hasStartedRecording={hasStartedRecording}
        setStartedRecording={setStartedRecording}
        setIsError={setIsError}
      />

      {recordedChunks.length > 0 && recordedVid && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            columnGap: '16px',
            mt: 3,
          }}
        >
          <Button variant="outlined" onClick={recordNewVideoHandler}>
            Record New Video
          </Button>
          <Button variant="contained" onClick={startUploadingVideo}>
            Save Video
          </Button>
        </Box>
      )}

      {isError && (
        <Dialog
          open={isError}
          onClose={errorModalCloseHandler}
          maxWidth="xs"
          fullWidth
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" align="center" my={2}>
              Camera or microphone is blocked
            </Typography>
            <Typography mb={1}>
              To start recording the video, you need access to the microphone
              and camera. To turn them on, please press on the blocked camera
              icon in the address bar of the web browser and reload the page.
            </Typography>

            <Box textAlign="end">
              <Button
                variant="outlined"
                size="small"
                onClick={errorModalCloseHandler}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};
