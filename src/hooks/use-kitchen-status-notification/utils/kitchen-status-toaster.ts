import { dismissToast, toast } from '../../../components/toast-container/utils/toast';
import { KitchenStatus } from '../types/kitchen-status.type';
import { Kitchen } from './kitchen';
import { KitchenStatusNotificationHistory } from './kitchen-status-notification-history';

/**
 * 주방 상태에 따른 토스트를 담당하는 클래스
 * - 기존 토스트는 새로운 토스트가 발생할 때 제거되어야 함
 * - 특정 일 특정 상태에 확인된 토스트는 새로고침과 상관없이 한 번만 발생해야 함
 * ex) 2024년 6월 14일 주방 마감 예정 토스트가 발생했고, 사용자가 해당 토스트를 닫은 경우
 *     해당 일의 주방 마감 시간 동안은 토스트가 발생하지 않음
 */
export class KitchenStatusToaster {
  private toastHistory = new KitchenStatusNotificationHistory<{
    isChecked: boolean;
  }>('kitchen-status-toast-history', {
    isChecked: false,
  });
  private currentToastId?: string | number;

  constructor(status: KitchenStatus) {
    // 이미 토스트한 경우 토스트x
    const isAlreadyChecked = this.toastHistory.isNow()
      && this.toastHistory.history.isChecked;

    if(!isAlreadyChecked) {
      this.toast(status);
    }
  }

  toast(status: KitchenStatus) {
    if(this.currentToastId) {
      dismissToast(this.currentToastId);
    }

    this.toastHistory.save({
      dateObj: Kitchen.today,
      status,
      isChecked: false,
    });
    
    let toastId;

    switch(status) {
      case KitchenStatus.Open:
        break;
      case KitchenStatus.Closing:
        toastId = this.toastClosing();
        break;
      case KitchenStatus.Closed:
        toastId = this.toastClosed();
        break;
    }

    this.currentToastId = toastId;
  }

  toastClosing() {
    const toastMessage = `주방이 ${Kitchen.closeTime.format('H시 mm분')}에 마감됩니다`;

    return toast('warning', toastMessage, {
      isInfinite: true,
      isFlicker: true,
      onClose: () => {
        if(this.toastHistory.isNow()) {
          this.toastHistory.save({
            ...this.toastHistory.history,
            isChecked: true,
          });
        }
      },
    });
  }

  toastClosed() {
    return toast('error', '주방이 마감되었습니다', {
      isInfinite: true,
      onClose: () => {
        if(this.toastHistory.isNow()) {
          this.toastHistory.save({
            ...this.toastHistory.history,
            isChecked: true,
          });
        }
      },
    });
  }
}