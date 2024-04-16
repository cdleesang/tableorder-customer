import { IConnection } from '@oz-k/cdleesang-tableorder-api-sdk';
import { useRecoilValue } from 'recoil';
import { tableNoState } from '../store/state';
import { API_URL } from '../constants/constant';

export function useConnection(): IConnection {
  const tableNo = useRecoilValue(tableNoState);

  return {
    host: API_URL,
    headers: {
      'tid': tableNo ? tableNo.toString() : '',
    },
  };
}