import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faArrowRotateRight, faCircle, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { SETTINGS_PASSWORD } from '../../common/constants/constant';
import { isSystemSettingsModalOpenState, tableNoState } from '../../store/state';
import './index.scss';
import Modal from '../modal';

function TableSettingsModal() {
  const [inputPassword, setInputPassword] = useState('');
  const setIsSettingsModalOpen = useSetRecoilState(isSystemSettingsModalOpenState);
  const [tableNo, setTableNo] = useRecoilState(tableNoState);

  useEffect(() => {
    if (inputPassword.length !== SETTINGS_PASSWORD.length) return;

    if (inputPassword !== SETTINGS_PASSWORD) setInputPassword('');
  }, [inputPassword]);

  return (
    <Modal className='settings-modal' close={() => setIsSettingsModalOpen(false)}>
      {
        inputPassword === SETTINGS_PASSWORD
          ? <div className="settings">
            <h3><FontAwesomeIcon icon={faGear} /> 테이블오더 설정</h3>
            <div className="tno-input">
              <label htmlFor='tno'>테이블 번호</label>
              <input
                id="tno"
                type="number"
                placeholder='0'
                value={tableNo}
                onChange={({ target: { value } }) => setTableNo(parseInt(value, 10) || undefined)}
              />
            </div>
            <button
              type='button'
              className="refresh"
              onClick={() => { window.location.href = '/'; }}
            >
              앱 새로고침
            </button>
          </div>
          : <div className="password">
            <div className="fields">
              {
                (new Array(4)).fill(undefined).map((_, index) => (
                  <div className="field" key={index}>
                    {
                      inputPassword[index] !== undefined
                        ? <FontAwesomeIcon icon={faCircle} />
                        : <FontAwesomeIcon icon={farCircle} />
                    }
                  </div>
                ))
              }
            </div>
            <div className="number-pad">
              {
                (new Array(9).fill(undefined).map((_, index) => (
                  <div onClick={() => setInputPassword(prev => prev + (index + 1))} key={index}>{index + 1}</div>
                )))
              }
              <div onClick={() => setInputPassword('')}>
                <FontAwesomeIcon icon={faArrowRotateRight} className="clear-icon" />
              </div>
              <div onClick={() => setInputPassword(prev => prev + 0)}>0</div>
              <div onClick={() => setInputPassword(prev => prev.slice(0, -1))}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
            </div>
          </div>
      }
    </Modal>
  );
}

export default TableSettingsModal;