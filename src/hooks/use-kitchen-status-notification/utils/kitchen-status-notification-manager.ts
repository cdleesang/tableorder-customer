import { KitchenStatus } from '../types/kitchen-status.type';
import { Kitchen } from './kitchen';
import { KitchenStatusAnnouncer } from './kitchen-status-announcer';
import { KitchenStatusToaster } from './kitchen-status-toaster';

/** 주방 상태 변경을 감지하고, 변경 시 알림을 담당하는 클래스 */
export class KitchenStatusNotificationManager {
  private static currentKitchenStatus: KitchenStatus = Kitchen.status;
  private static intervalId: NodeJS.Timeout | null = null;
  private static announcer = new KitchenStatusAnnouncer(this.currentKitchenStatus);
  private static toaster = new KitchenStatusToaster(this.currentKitchenStatus);

  static start() {
    const DETECT_INTERVAL = 10000;

    this.intervalId = setInterval(() => {
      const currentKitchenStatus = Kitchen.status;

      if(this.currentKitchenStatus === Kitchen.status) return;

      this.currentKitchenStatus = currentKitchenStatus;

      this.toaster.toast(currentKitchenStatus);
      this.announcer.announce(currentKitchenStatus);
    }, DETECT_INTERVAL);
  }

  static stop() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private constructor() {}
}