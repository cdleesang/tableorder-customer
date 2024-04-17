import { useRecoilValue } from 'recoil';
import SystemSettingsModal from './pages/system-settings-modal';
import Main from './pages/main';
import ScreenSaver from './pages/screen-saver';
import { isCallStaffModalOpenState, isStaffSettingsModalOpenState, isSystemSettingsModalOpenState } from './store/state';
import CallStaffModal from './pages/call-staff-modal';
import { useEffect, useRef } from 'react';
import moment from 'moment';
import { dismissToast, toast } from './components/toast-container/utils/toast';
import ToastContainer from './components/toast-container';
import StaffSettingsModal from './pages/staff-settings-modal';

function App() {
  const isCallStaffModalOpen = useRecoilValue(isCallStaffModalOpenState);
  const isStaffSettingsModalOpen = useRecoilValue(isStaffSettingsModalOpenState);
  const isSystemSettingsModalOpen = useRecoilValue(isSystemSettingsModalOpenState);
  const kitchenStatus = useRef<{
    status: 'open' | 'closing' | 'closed',
    isNotified: boolean,
    currentToastId?: string | number,
  }>({
    status: 'open',
    isNotified: false,
  });

  /** 
   * 2시(월요일은 1시)가 되면 1회성 주방 마감 예정 Toast
   * 2시 30분(월요일은 1시 30분)이 되면 1회성 주방 마감 Toast + 기존 Toast 제거
   * 9시가 되면 기존 Toast 제거
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const isMonday = now.day() === 1;
      const closingTime = isMonday
        ? moment('01:00:00', 'HH:mm:ss')
        : moment('02:00:00', 'HH:mm:ss');
      const closedTime = isMonday
        ? moment('01:30:00', 'HH:mm:ss')
        : moment('02:30:00', 'HH:mm:ss');
      const openTime = moment('09:00:00', 'HH:mm:ss');

      // TODO: server pm2 ecosystem 구축, react production env 설정

      const isClosingTime = now.isBetween(
        closingTime,
        closedTime,
      );
      
      const isClosedTime = now.isBetween(
        closedTime,
        openTime
      );

      if(isClosingTime) {
        if(
          kitchenStatus.current.status === 'closing'
            && kitchenStatus.current.isNotified
        ) return;

        const toastId = toast('warning', `주방이 ${closedTime.format('H시 mm분')}에 마감됩니다`, {
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
      {isStaffSettingsModalOpen && <StaffSettingsModal />}
      {isSystemSettingsModalOpen && <SystemSettingsModal />}
      <ToastContainer />
    </>
  );
}

export default App;