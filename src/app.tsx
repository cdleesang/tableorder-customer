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
import useKitchenStatusToast from './hooks/use-kitchen-status-toast';
import { SSE } from './sse/sse';
import { isCallStaffModalOpenState, isOrderHistoryModalOpenState, isSystemSettingsModalOpenState } from './store/state';

function App() {
  const isOrderHistoryModalOpen = useRecoilValue(isOrderHistoryModalOpenState);
  const isCallStaffModalOpen = useRecoilValue(isCallStaffModalOpenState);
  const isSystemSettingsModalOpen = useRecoilValue(isSystemSettingsModalOpenState);
  const connection = useConnection();

  useKitchenStatusToast();

  useEffect(() => {
    SSE.init(connection.host);
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