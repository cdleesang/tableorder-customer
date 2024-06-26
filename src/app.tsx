import { Suspense, lazy, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilValue } from 'recoil';
import './app.scss';
import Header from './components/header';
import IdleTimerRoot from './components/idle-timer/idle-timer-root';
import ToastContainer from './components/toast-container';
import useKitchenStatusNotification from './hooks/use-kitchen-status-notification';
import { SSE } from './hooks/use-sse/sse';
import { useTableConnection } from './hooks/use-table-connection';
import { isCallStaffModalOpenState, isOrderHistoryModalOpenState, isSystemSettingsModalOpenState } from './store/state';

const OrderHistoryModal = lazy(() => import('./components/order-history-modal'));
const CallStaffModal = lazy(() => import('./components/call-staff-modal'));
const TableSettingsModal = lazy(() => import('./components/table-settings-modal'));

function App() {
  const isOrderHistoryModalOpen = useRecoilValue(isOrderHistoryModalOpenState);
  const isCallStaffModalOpen = useRecoilValue(isCallStaffModalOpenState);
  const isSystemSettingsModalOpen = useRecoilValue(isSystemSettingsModalOpenState);
  const connection = useTableConnection();

  useKitchenStatusNotification();

  const resizeViewport = useCallback(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }, []);

  useEffect(() => {
    SSE.init(connection.host);

    resizeViewport();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', resizeViewport);

    return () => {
      window.removeEventListener('resize', resizeViewport);
    };
  }, [window.innerHeight])

  return (
    <div className='app'>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, interactive-widget=overlays-content" />
      </Helmet>
      <IdleTimerRoot>
        <Header />
        <div className="body"><Outlet /></div>
        {isOrderHistoryModalOpen && <Suspense fallback={null}><OrderHistoryModal /></Suspense>}
        {isCallStaffModalOpen && <Suspense fallback={null}><CallStaffModal /></Suspense>}
        {isSystemSettingsModalOpen && <Suspense fallback={null}><TableSettingsModal /></Suspense>}
        <ToastContainer />
      </IdleTimerRoot>
    </div>
  );
}

export default App;