import { sleep } from '../../../common/utils/sleep.util';
import KitchenClosingAnnounceMP3 from '../../../assets/sounds/kitchen-closing-announce.mp3';
import plingSoundMP3 from '../../../assets/sounds/pling.mp3';
import { KitchenStatus } from '../types/kitchen-status.type';
import { Kitchen } from './kitchen';
import { KitchenStatusNotificationHistory } from './kitchen-status-notification-history';

/**
 * 주방 상태에 따른 아나운스를 담당하는 클래스
 * - 특정 일 특정 상태에 대해서는 새로고침과 상관없이 한 번만 아나운스
 * ex) 2024년 6월 14일 주방 마감 예정 아나운스가 발생한 경우
 *     해당 일의 주방 마감 시간 동안은 아나운스가 발생하지 않음
 */
export class KitchenStatusAnnouncer {
  private static instance: KitchenStatusAnnouncer;
  private announceHistory = new KitchenStatusNotificationHistory('kitchen-status-announce-history', {});

  static getInstance(status: KitchenStatus) {
    if(!this.instance) {
      this.instance = new KitchenStatusAnnouncer(status);
    }

    return this.instance;
  }

  private constructor(status: KitchenStatus) {
    // 이미 아나운스 한 경우 아나운스x
    const isAlreadyAnnounced = this.announceHistory.isNow();

    if(!isAlreadyAnnounced) {
      this.announce(status);
    }
  }

  announce(status: KitchenStatus) {
    this.announceHistory.save({
      dateObj: Kitchen.today,
      status,
    });

    switch(status) {
      case KitchenStatus.Open:
        break;
      case KitchenStatus.Closing:
        this.playClosingAnnounce();
        break;
      case KitchenStatus.Closed:
        break;
    }
  }

  /** 주방 마감 예정 아나운스 */
  private async playClosingAnnounce() {
    const PLING_VOLUME = 1;
    const PLING_PLAYBACK_RATE = 1.1;
    const PLING_DURATION = 1400;
    const KITCHEN_CLOSING_VOLUME = .7;
    const KITCHEN_CLOSING_PLAYBACK_RATE = 0.96;

    const plingSound = new Audio(plingSoundMP3);
    plingSound.volume = PLING_VOLUME;
    plingSound.preservesPitch = false;
    plingSound.playbackRate = PLING_PLAYBACK_RATE;

    const kitchenClosingSound = new Audio(KitchenClosingAnnounceMP3);
    kitchenClosingSound.volume = KITCHEN_CLOSING_VOLUME;
    kitchenClosingSound.preservesPitch = false;
    kitchenClosingSound.playbackRate = KITCHEN_CLOSING_PLAYBACK_RATE;

    try {
      await plingSound.play();
      await sleep(PLING_DURATION);
      await kitchenClosingSound.play();
    } catch(err) {
      console.warn(err);
    }
  }
}