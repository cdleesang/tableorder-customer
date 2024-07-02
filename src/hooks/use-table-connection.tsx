import { IConnection } from '@cdleesang/tableorder-api-sdk';
import { API_URL } from '../common/constants/constant';
import { LocalStorage } from '../store/local-storage';

export function useTableConnection(): IConnection<{
  tid: string;
}> {
  const {tableNo} = LocalStorage;

  return {
    host: API_URL,
    headers: {
      tid: tableNo ? tableNo.toString() : '',
    },
  };
}