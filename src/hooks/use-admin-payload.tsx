import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { jwtDecode } from 'jwt-decode';
import { adminAccessTokenState } from '../store/state';

const AdminPermission = {
  MANAGE_ADMIN_PERMISSION: 'manage_admin_permission',
  DELETE_ADMIN: 'delete_admin',

  VIEW_ORDER: 'view_order',

  PARING_TABLE: 'paring_table',
} as const;

interface AdminPayload {
  adminId: string;
  permissions: typeof AdminPermission[keyof typeof AdminPermission][];
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