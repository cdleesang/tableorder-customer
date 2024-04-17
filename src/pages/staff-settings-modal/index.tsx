import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '@cdleesang/tableorder-api-sdk';
import { useSetRecoilState } from 'recoil';
import { useConnection } from '../../service/connection';
import { isStaffSettingsModalOpenState, setEnteredAt } from '../../store/state';
import './index.scss';

function StaffSettingsModal() {
  const setIsStaffSettingsModalOpen = useSetRecoilState(isStaffSettingsModalOpenState);
  const connection = useConnection();

  return <>
      <div className="staff-settings-modal-backdrop" onClick={() => setIsStaffSettingsModalOpen(false)} />
      <div className="staff-settings-modal">
        <div className="settings">
          <h3><FontAwesomeIcon icon={faWarning}/>&nbsp;&nbsp;&nbsp;관리자 전용 설정 화면입니다&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faWarning}/></h3>
          <button
            type='button'
            className="clean-up"
            onClick={() => {
              api.functional.cart.clearCart(connection)
                .then(() => {
                  setEnteredAt(new Date());
                  window.location.reload()
                })
                .catch(() => {
                  alert('테이블 정리 중 오류가 발생했습니다');
                })
            }}
          >
            테이블 정리
          </button>
          <button
            type='button'
            className="refresh"
            onClick={() => window.location.reload()}
            >
              앱 새로고침
          </button>
        </div>
      </div>
    </>;
}

export default StaffSettingsModal;