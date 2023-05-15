const RECORD_TIME = 62000;
const FRAME_RATE = 30;
const MID_QUALITY = 480;
const GOOD_QUALITY = 720;
const VIDEO_HEIGHT = 360;
const ONE_SECOND_IN_MS = 1000;

const VIDEO_CONSTRAINS = {
  width: { min: MID_QUALITY, ideal: GOOD_QUALITY, max: GOOD_QUALITY },
  height: { min: VIDEO_HEIGHT },
  frameRate: FRAME_RATE,
  facingMode: 'user',
};

export {
  RECORD_TIME,
  FRAME_RATE,
  MID_QUALITY,
  GOOD_QUALITY,
  VIDEO_HEIGHT,
  ONE_SECOND_IN_MS,
  VIDEO_CONSTRAINS,
}