import { useEffect, useState } from 'react';
import Modal from '../../../../components/modal';
import { ADMIN_PERMISSIONS } from '../../../../hooks/use-admin-payload';
import api from '@cdleesang/tableorder-api-sdk';
import { useAdminConnection } from '../../../../hooks/use-admin-connection';
import { AdminPermission } from '@cdleesang/tableorder-api-sdk/lib/structures/AdminPermission';

export function UpdateAdminPermissionModal({
  adminId,
  close,
}: {
  adminId: string;
  close: () => void;
}) {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const connection = useAdminConnection();

  useEffect(() => {
    api.functional.api.auth.admin.permissions.viewAdminPermissions(connection, adminId)
      .then(setPermissions);
  }, []);

  return <Modal
    className='!w-2/5 min-w-64 max-w-96 !h-min text-white'
    close={close}
  >
    <h2 className='text-lg font-semibold'>관리자 권한 변경</h2>
    <div>
      {
        Object.values(ADMIN_PERMISSIONS).map((permission) => (
          <div
            key={permission.key}
            className='flex items-center gap-2 mt-4'
          >
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                className='w-4 h-4 cursor-pointer accent-button'
                checked={permissions.some((p) => p === permission.key)}
                onChange={() => {
                  setPermissions((prev) => {
                    if(prev.some((p) => p === permission.key)) {
                      return prev.filter((p) => p !== permission.key);
                    }

                    return [...prev, permission.key];
                  });
                }}
              />
              <span>{permission.description}</span>
            </label>
          </div>
        ))
      }
    </div>
    <button
      className='bg-point text-white p-1 px-2 rounded-md font-medium w-full mt-4'
      onClick={async () => {
        try {
          await api.functional.api.auth.admin.permissions.updateAdminPermissions(connection, adminId, {
            permissions,
          });

          alert('권한이 변경되었습니다');
          close();
        } catch(err) {
          if(err instanceof api.HttpError) {
            if(err.status === 403) {
              return alert('권한 변경 권한이 없습니다');
            }
            if(err.status === 409) {
              return alert('본인의 권한은 변경할 수 없습니다');
            }
          }
        }
      }}
    >변경</button>
  </Modal>
}