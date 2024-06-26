import api from '@cdleesang/tableorder-api-sdk';
import { CallOption } from '@cdleesang/tableorder-api-sdk/lib/structures/CallOption';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTableConnection } from '../../hooks/use-table-connection';
import { isCallStaffModalOpenState } from '../../store/state';
import Modal from '../modal';
import { toast } from '../toast-container/utils/toast';
import CallOptions from './call-options';

type CurrentOptions = Record<string, {
  id: number;
  isSelected: boolean;
  count: number;
}>;

function CallStaffModal() {
  const setIsCallStaffModalOpen = useSetRecoilState(isCallStaffModalOpenState);
  const [callOptions, setCallOptions] = useState<CallOption[]>([]);
  const connection = useTableConnection();
  const [currentOptions, setCurrentOptions] = useState<CurrentOptions>({});
  const isActive = useMemo(() => {
    return Object.values(currentOptions).some(({ isSelected }) => isSelected);
  }, [currentOptions])

  useEffect(() => {
    api.functional.call_staff.option.getCallStaffOptions(connection)
      .then(options => {
        const newOptions = [
          ...options,
          {
            id: 999,
            title: '얼음잔',
            isCountable: true,
          },
        ];
        setCallOptions([...newOptions]);
        setCurrentOptions(
          newOptions.reduce((acc, option) => ({
            ...acc,
            [option.id]: {
              id: option.id,
              isSelected: false,
              count: 1,
            },
          }), {} as CurrentOptions),
        );
      })
      .catch(err => {
        localStorage.setItem('getCallStaffOptions', `${moment().format('YYYY-MM-DD HH:mm:ss')} ${JSON.stringify(err)}`);

        toast('error', '직원 호출 옵션을 불러오는 중 오류가 발생했습니다');
      });
  }, []);

  return (
    <Modal className='flex flex-col justify-between' close={() => setIsCallStaffModalOpen(false)}>
      <h2 className="text-2xl font-semibold">
        어떤 도움이 필요하신가요?
      </h2>
      <div className="flex flex-col gap-5">
        <CallOptions
          options={callOptions.filter(({ isCountable }) => !isCountable)}
          currentOptions={currentOptions}
          setCurrentOptions={setCurrentOptions}
        />
        <CallOptions
          isCountable
          options={callOptions.filter(({ isCountable }) => isCountable)}
          currentOptions={currentOptions}
          setCurrentOptions={setCurrentOptions}
        />
      </div>
      <button
        disabled={!isActive}
        className={`!bg-point !text-font !transition-opacity !font-semibold !duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
        type="button"
        onClick={() => {
          const selectedOptions = Object.values(currentOptions).filter(({ isSelected }) => isSelected);

          api.functional.call_staff.callStaff(connection, {
            options: selectedOptions.map(({ id, count }) => ({
              id,
              title: callOptions.find(option => option.id === id)!.title,
              quantity: count,
            })),
          }).then(() => {
            toast('success', '직원을 호출했습니다');
          }).catch(err => {
            localStorage.setItem('callStaffError', `${moment().format('YYYY-MM-DD HH:mm:ss')} ${JSON.stringify(err)}`);
            toast('error', '직원 호출에 실패했습니다');
          });

          setIsCallStaffModalOpen(false);
        }}
      >
        직원 호출하기
      </button>
    </Modal>
  );
}

export default CallStaffModal;