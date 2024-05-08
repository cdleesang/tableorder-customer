import { useRecoilValue } from 'recoil';
import ToastContainer from './components/toast-container';
import CallStaffModal from './pages/call-staff-modal';
import Main from './pages/main';
import ScreenSaver from './pages/screen-saver';
import TableSettingsModal from './pages/table-settings-modal';
import useKitchenStatusToast from './hooks/use-kitchen-status-toast';
import { isCallStaffModalOpenState, isSystemSettingsModalOpenState } from './store/state';

function App() {
  const isCallStaffModalOpen = useRecoilValue(isCallStaffModalOpenState);
  const isSystemSettingsModalOpen = useRecoilValue(isSystemSettingsModalOpenState);
  
  KitchenStatusToaster();

  return (
    <>
      <Main />
      {isCallStaffModalOpen && <CallStaffModal />}
      <ScreenSaver />
      {isSystemSettingsModalOpen && <TableSettingsModal />}
      <ToastContainer />
    </>
  );
}

export default App;