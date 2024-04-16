import { useRecoilValue } from 'recoil';
import SettingsModal from './pages/settings-modal';
import Main from './pages/main';
import ScreenSaver from './pages/screen-saver';
import { isCallStaffModalOpenState, isSettingsModalOpenState } from './store/state';
import CallStaffModal from './pages/call-staff-modal';
import { useEffect, useRef } from 'react';
import moment from 'moment';
import { dismissToast, toast } from './components/toast-container/utils/toast';
import ToastContainer from './components/toast-container';

function App() {
  const isCallStaffModalOpen = useRecoilValue(isCallStaffModalOpenState);
  const isSettingsModalOpen = useRecoilValue(isSettingsModalOpenState);
  const kitchenStatus = useRef<{
    status: 'open' | 'closing' | 'closed',
    isNotified: boolean,
    currentToastId?: string | number,
  }>({
    status: 'open',
    isNotified: false,
  });

  /** 
   * 2시가 되면 1회성 주방 마감 예정 Toast
   * 2시 30분이 되면 1회성 주방 마감 Toast + 기존 Toast 제거
   * 9시가 되면 기존 Toast 제거
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const isClosingTime = now.isBetween(
        moment('02:00:00', 'HH:mm:ss'),
        moment('02:30:00', 'HH:mm:ss'),
      );
      const isClosedTime = now.isBetween(
        moment('02:30:00', 'HH:mm:ss'),
        moment('09:00:00', 'HH:mm:ss'),
      );

      if(isClosingTime) {
        if(
          kitchenStatus.current.status === 'closing'
            && kitchenStatus.current.isNotified
        ) return;

        const toastId = toast('warning', '주방이 2시 30분에 마감됩니다', {
          isInfinite: true,
          isFlicker: true,
        });

        kitchenStatus.current = {
          status: 'closing',
          isNotified: true,
          currentToastId: toastId,
        };

        
      } else if(isClosedTime) {
        if(
          kitchenStatus.current.status === 'closed'
            && kitchenStatus.current.isNotified
        ) return;
        if(kitchenStatus.current.currentToastId !== undefined)
          dismissToast(kitchenStatus.current.currentToastId);

        const toastId = toast('error', '주방이 마감되었습니다', {
          isInfinite: true,
        });

        kitchenStatus.current = {
          status: 'closed',
          isNotified: true,
          currentToastId: toastId,
        };
      } else {
        if(kitchenStatus.current.currentToastId !== undefined)
          dismissToast(kitchenStatus.current.currentToastId);

        kitchenStatus.current = {
          status: 'open',
          isNotified: false,
        };
      }
    }, 10 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Main />
      {isCallStaffModalOpen && <CallStaffModal />}
      <ScreenSaver />
      {isSettingsModalOpen && <SettingsModal />}
      <ToastContainer />
    </>
  );
}

export default App;