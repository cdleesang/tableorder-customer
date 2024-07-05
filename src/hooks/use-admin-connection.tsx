import { IConnection } from '@cdleesang/tableorder-api-sdk';
import { useRecoilValue } from 'recoil';
import { adminAccessTokenState } from '../store/state';
import { API_URL } from '../common/constants/constant';

export function useAdminConnection(): IConnection {
  const accessToken = useRecoilValue(adminAccessTokenState);

  return {
    host: API_URL,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
}