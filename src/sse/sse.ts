import { ValueOf } from '../common/types/value-of.type';

const NOTIFICATION_TYPE = {
  SlideImageChanged: 'SlideImageChanged',
} as const;


export type Observer = {
  type: ValueOf<typeof NOTIFICATION_TYPE>,
  onMessage: (data: any) => void,
  onReconnect: () => void,
}

export class SSE {
  private static RETRY_INTERVAL = 5000;
  private static observers: Observer[] = [];
  private static retryQueue: (() => void)[] = [];

  private constructor() {}

  static init(host: string) {
    setInterval(() => {
      while(this.retryQueue.length > 0) {
        this.retryQueue.shift()?.();
      }
    }, this.RETRY_INTERVAL);

    this.connectNotificationSSE(host);
  }

  private static connectNotificationSSE(host: string) {
    const eventSource = new EventSource(`${host}/notification/sse`);

    eventSource.onerror = () => {
      eventSource.close();
      this.retryQueue.push(() => this.connectNotificationSSE(host));
    }

    eventSource.onopen = () => {
      this.observers.forEach(o => {
        if(Object.values(NOTIFICATION_TYPE).includes(o.type)) {
          o.onReconnect();
        }
      });
    }

    Object.values(NOTIFICATION_TYPE).forEach(type => {
      this.addEventListener(eventSource, type);
    });
  }

  private static addEventListener(
    eventSource: EventSource,
    type: Observer['type'],
  ) {
    eventSource.addEventListener(type, event => {
      this.observers.forEach(o => {
        if(o.type === type) {
          o.onMessage(JSON.parse(event.data));
        }
      });
    });
  }

  static subscribe(observer: Observer) {
    this.observers.push(observer);
  }
  
  static unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
}