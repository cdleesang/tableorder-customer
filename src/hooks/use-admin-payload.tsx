import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { jwtDecode } from 'jwt-decode';
import { adminAccessTokenState } from '../store/state';

export const ADMIN_PERMISSIONS = {
  MANAGE_ADMIN_PERMISSION: {
    key: 'manage_admin_permission',
    description: '관리자 권한 관리',
  },
  DELETE_ADMIN: {
    key: 'delete_admin',
    description: '관리자 삭제',
  },
  VIEW_ORDER: {
    key: 'view_order',
    description: '주문 내역 조회',
  },
  PARING_TABLE: {
    key: 'paring_table',
    description: '테이블 페어링',
  },
} as const;

interface AdminPayload {
  adminId: string;
  permissions: typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS]['key'][];
}

export function useAdminPayload() {
  const [payload, setPayload] = useState<AdminPayload | null>(null);
  const accessToken = useRecoilValue(adminAccessTokenState);

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode<AdminPayload>(accessToken);
      setPayload(decodedToken);
    }
  }, [accessToken]);

  return payload;
}