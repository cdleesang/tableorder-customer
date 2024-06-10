import notificationSoundMP3 from '../../assets/sounds/notification.mp3';
import { sleep } from './sleep.util';

export async function playNotificationSound() {
  const VOLUME = 1;
  const PLAYBACK_RATE = 1.1;
  const DURATION = 1400;

  const notificationAudio = new Audio(notificationSoundMP3);
  notificationAudio.volume = VOLUME;
  notificationAudio.preservesPitch = false;
  notificationAudio.playbackRate = PLAYBACK_RATE;

  await notificationAudio.play();
  await sleep(DURATION);
}