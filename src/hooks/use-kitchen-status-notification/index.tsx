import { useEffect } from 'react';
import { KitchenStatusNotificationManager } from './utils/kitchen-status-notification-manager';

function useKitchenStatusNotification() {
  useEffect(() => {
    KitchenStatusNotificationManager.start();
    
    return () => {
      KitchenStatusNotificationManager.stop();
    };
  }, []);
}

export default useKitchenStatusNotification;