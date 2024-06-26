import { useEffect, useRef } from 'react';
import { KitchenStatusAnnouncer } from './utils/kitchen-status-announcer';
import { Kitchen } from './utils/kitchen';
import { KitchenStatusToaster } from './utils/kitchen-status-toaster';

function useKitchenStatusNotification() {
  const currentKitchenStatus = useRef(Kitchen.status);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const announcer = KitchenStatusAnnouncer.getInstance(currentKitchenStatus.current);
  const toaster = KitchenStatusToaster.getInstance(currentKitchenStatus.current);
  const DETECT_INTERVAL = 10000;

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const {status} = Kitchen;

      if(currentKitchenStatus.current === status) return;

      currentKitchenStatus.current = status;

      toaster.toast(status);
      announcer.announce(status);
    }, DETECT_INTERVAL);
    
    return () => {
      if(intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);
}

export default useKitchenStatusNotification;