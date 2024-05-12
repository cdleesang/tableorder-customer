import { IConnection } from '@cdleesang/tableorder-api-sdk';
import { API_URL } from '../common/constants/constant';
import { tableNoKey } from '../store/state';

export function useConnection(): IConnection<{
  tid: string;
}> {
  const tableNo = localStorage.getItem(tableNoKey);

  return {
    host: API_URL,
    headers: {
      'tid': tableNo ? tableNo.toString() : '',
    },
  };
}