import moment from 'moment';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import ToastContainer from './components/toast-container';
import { dismissToast, toast } from './components/toast-container/utils/toast';
import CallStaffModal from './pages/call-staff-modal';
import Main from './pages/main';
import ScreenSaver from './pages/screen-saver';
import StaffSettingsModal from './pages/staff-settings-modal';
import SystemSettingsModal from './pages/system-settings-modal';
import { isCallStaffModalOpenState, isStaffSettingsModalOpenState, isSystemSettingsModalOpenState } from './store/state';

type KitchenStatus = {
  status: 'open' | 'closing' | 'closed',
  isNotified: boolean,
  currentToastId?: string | number,
};

/** 
 * 2시(월요일은 1시)가 되면 1회성 주방 마감 예정 Toast
 * 2시 30분(월요일은 1시 30분)이 되면 1회성 주방 마감 Toast + 기존 Toast 제거
 * 9시가 되면 기존 Toast 제거
 */
function toastKitchenStatus(currentStatus: KitchenStatus, setStatus: (status: KitchenStatus) => void) {
  const now = moment();
  const isMonday = now.day() === 1;
  const closedTime = isMonday
    ? moment('01:30:00', 'HH:mm:ss')
    : moment('02:30:00', 'HH:mm:ss');
  const closingTime = closedTime.clone().subtract(30, 'minutes');
  const openTime = moment('09:00:00', 'HH:mm:ss');

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
      currentStatus.status === 'closing'
        && currentStatus.isNotified
    ) return;

    const toastId = toast('warning', `주방이 ${closedTime.format('H시 mm분')}에 마감됩니다`, {
      isInfinite: true,
      isFlicker: true,
    });

    setStatus({
      status: 'closing',
      isNotified: true,
      currentToastId: toastId,
    });
  } else if(isClosedTime) {
    if(
      currentStatus.status === 'closed'
        && currentStatus.isNotified
    ) return;
    if(currentStatus.currentToastId !== undefined)
      dismissToast(currentStatus.currentToastId);

    const toastId = toast('error', '주방이 마감되었습니다', {
      isInfinite: true,
    });

    setStatus({
      status: 'closed',
      isNotified: true,
      currentToastId: toastId,
    });
  } else {
    if(currentStatus.currentToastId !== undefined)
      dismissToast(currentStatus.currentToastId);

    setStatus({
      status: 'open',
      isNotified: false,
    });
  }
}

function App() {
  const isCallStaffModalOpen = useRecoilValue(isCallStaffModalOpenState);
  const isStaffSettingsModalOpen = useRecoilValue(isStaffSettingsModalOpenState);
  const isSystemSettingsModalOpen = useRecoilValue(isSystemSettingsModalOpenState);
  const kitchenStatus = useRef<KitchenStatus>({
    status: 'open',
    isNotified: false,
  });

  useEffect(() => {
    toastKitchenStatus(kitchenStatus.current, (status) => {
      kitchenStatus.current = status;
    });

    const interval = setInterval(() => {
      toastKitchenStatus(kitchenStatus.current, (status) => {
        kitchenStatus.current = status;
      });
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