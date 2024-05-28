import { useEffect } from 'react';
import { Outlet, } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilValue } from 'recoil';
import './app.scss';
import CallStaffModal from './components/call-staff-modal';
import Header from './components/header';
import IdleTimerRoot from './components/idle-timer/idle-timer-root';
import OrderHistoryModal from './components/order-history-modal';
import TableSettingsModal from './components/table-settings-modal';
import ToastContainer from './components/toast-container';
import { useConnection } from './hooks/use-connection';
import useKitchenStatusNotification from './hooks/use-kitchen-status-notification';
import { SSE } from './hooks/use-sse/sse';
import { isCallStaffModalOpenState, isOrderHistoryModalOpenState, isSystemSettingsModalOpenState } from './store/state';

function App() {
  const isOrderHistoryModalOpen = useRecoilValue(isOrderHistoryModalOpenState);
  const isCallStaffModalOpen = useRecoilValue(isCallStaffModalOpenState);
  const isSystemSettingsModalOpen = useRecoilValue(isSystemSettingsModalOpenState);
  const connection = useConnection();

  useKitchenStatusNotification();

  useEffect(() => {
    SSE.init(connection.host);
    
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }, []);

  return (
    <IdleTimerRoot>
      <Header />
      <div className="body"><Outlet /></div>
      {isOrderHistoryModalOpen && <OrderHistoryModal />}
      {isCallStaffModalOpen && <CallStaffModal />}
      {isSystemSettingsModalOpen && <TableSettingsModal />}
      <ToastContainer />
    </IdleTimerRoot>
  );
}

export default App;