import { useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import logo from '../../../assets/logo.png';
import { isCallStaffModalOpenState, isOrderHistoryModalOpenState, isSystemSettingsModalOpenState, tableNoState } from '../../../store/state';
import './index.scss';

function Header() {
  const tableNo = useRecoilValue(tableNoState);
  const [clickCount, setClickCount] = useState(0);
  const setTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const setIsSystemSettingsModalOpen = useSetRecoilState(isSystemSettingsModalOpenState);
  const [isCallStaffModalOpen, setIsCallStaffModalOpen] = useRecoilState(isCallStaffModalOpenState);
  const [isOrderHistoryModalOpen, setIsOrderHistoryModalOpen] = useRecoilState(isOrderHistoryModalOpenState);

  const handleClick = () => {
    setClickCount(prev => prev+1);
    
    if(setTimeoutId.current) clearTimeout(setTimeoutId.current);
    
    if(clickCount+1 >= 3) setIsSystemSettingsModalOpen(true);

    setTimeoutId.current = setTimeout(() => {
      setClickCount(0);
    }, 400);
  }

  return (
    <>
      <div className="header">
        <div className="brand">
          <div
            className="brand-wrapper"
            onClick={() => window.location.href = '/'}
          >
            <img className="logo" src={logo} alt="logo" />
            <span className="brand-name">청담이상</span>
          </div>
        </div>
        <button
          className="call-staff-btn"
          type="button"
          onClick={() => setIsCallStaffModalOpen(!isCallStaffModalOpen)}
        >
          직원 호출
        </button>
        <div className="table-info">
          <span className="table-no" onClick={handleClick}>
            {tableNo !== undefined ? <>
              <span className="number">{tableNo}</span>
              번 테이블
            </> : <>
              <span className="error">테이블 번호를 설정해주세요</span>
            </>}
          </span>
          <button
            className="order-history-btn"
            type="button"
            onClick={() => setIsOrderHistoryModalOpen(!isOrderHistoryModalOpen)}
          >주문내역</button>
        </div>
      </div>
    </>
  );
}

export default Header;