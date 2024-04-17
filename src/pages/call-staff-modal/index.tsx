import api from '@oz-k/cdleesang-tableorder-api-sdk';
import { CallOption } from '@oz-k/cdleesang-tableorder-api-sdk/lib/structures/CallOption';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import CallOptions from './call-options';
import { useConnection } from '../../service/connection';
import { isCallStaffModalOpenState } from '../../store/state';
import './index.scss';
import { toast } from '../../components/toast-container/utils/toast';

function CallStaffModal() {
  const setIsCallStaffModalOpen = useSetRecoilState(isCallStaffModalOpenState);
  const [callOptions, setCallOptions] = useState<CallOption[]>([]);
  const connection = useConnection();
  const [currentOptions, setCurrentOptions] = useState<Record<string, {
    id: number;
    isSelected: boolean;
    count: number;
  }>>({});

  useEffect(() => {
    api.functional.call_staff.option.getCallStaffOptions(connection)
      .then(options => {
        setCallOptions(options);
        setCurrentOptions(options.reduce((acc, option) => ({
          ...acc,
          [option.id]: {
            id: option.id,
            isSelected: false,
            count: 1
          }
        }), {}));
      })
      .catch(() => {
        toast('error', '직원 호출 옵션을 불러오는 중 오류가 발생했습니다');
      });
  }, []);

  return (
    <>
      <div className="call-staff-backdrop" onClick={() => setIsCallStaffModalOpen(false)}></div>
      <div className="call-staff">
        <h2 className="call-staff-title">
          어떤 도움이 필요하신가요?
        </h2>
        <div className="call-staff-options-container">
          <CallOptions
            options={callOptions.filter(({isCountable}) => !isCountable)}
            currentOptions={currentOptions}
            setCurrentOptions={setCurrentOptions}
          />
          <CallOptions
            isCountable
            options={callOptions.filter(({isCountable}) => isCountable)}
            currentOptions={currentOptions}
            setCurrentOptions={setCurrentOptions}
          />
        </div>
        <button
          disabled={!Object.values(currentOptions).some(({isSelected}) => isSelected)}
          className="call-staff-button"
          type="button"
          onClick={() => {
            const selectedOptions = Object.values(currentOptions).filter(({isSelected}) => isSelected);

            api.functional.call_staff.callStaff(connection, {
              options: selectedOptions.map(({id, count}) => ({
                id,
                title: callOptions.find(option => option.id === id)!.title,
                quantity: count
              })),
            }).then(() => {
              toast('success', '직원을 호출했습니다');
            }).catch(() => {
              toast('error', '직원 호출에 실패했습니다');
            });

            setIsCallStaffModalOpen(false);
          }}
        >
          직원 호출하기
        </button>
      </div>
    </>
  );
}

export default CallStaffModal;