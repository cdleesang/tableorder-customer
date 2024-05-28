import { KitchenStatus } from '../types/kitchen-status.type';
import { Kitchen } from './kitchen';

interface History {
  dateObj: {
    year: number;
    month: number;
    date: number;
  };
  status: KitchenStatus;
}

export class KitchenStatusNotificationHistory<T extends Record<string, any>> {
  private data: History & T;

  constructor(private key: string, defaultHistory: T) {
    const historyStr = localStorage.getItem(key);

    if(historyStr) {
      this.data = JSON.parse(historyStr);
    } else {
      this.data = {
        dateObj: {year: 0, month: 0, date: 0},
        status: KitchenStatus.Open,
        ...defaultHistory,
      };
    }
  }

  get history() {
    return this.data;
  }

  save(history: T & Partial<History>) {
    const data = {
      dateObj: Kitchen.today,
      status: Kitchen.status,
      ...history,
    };
    
    this.data = data;

    localStorage.setItem(this.key, JSON.stringify(data));
  }

  /** 현재 주방의 날짜 및 상태가 현재 히스토리와 같은지 확인 */
  isNow() {
    return (
      this.data.dateObj.year === Kitchen.today.year
        && this.data.dateObj.month === Kitchen.today.month
        && this.data.dateObj.date === Kitchen.today.date
        && this.data.status === Kitchen.status
    );
  }
}