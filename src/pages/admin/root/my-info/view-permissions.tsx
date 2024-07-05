import { ADMIN_PERMISSIONS, useAdminPayload } from '../../../../hooks/use-admin-payload';

export function ViewPermissions() {
  const payload = useAdminPayload();

  return (
    <div>
      <h2 className='text-xl font-semibold'>내 권한 목록</h2>
      <div className='flex gap-2 mt-2 flex-wrap'
      >
        {
          payload && payload.permissions.map((permission) => (
            <span
              key={permission}
              className='border border-gray-300 rounded-full p-1 px-2 text-sm font-semibold whitespace-nowrap'
            >
              {Object.values(ADMIN_PERMISSIONS).find((p) => p.key === permission)?.description}
            </span>
          ))
        }
      </div>
    </div>
  );
}