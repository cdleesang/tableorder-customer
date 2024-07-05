import api from '@cdleesang/tableorder-api-sdk';
import { SearchResponseDto } from '@cdleesang/tableorder-api-sdk/lib/structures/SearchResponseDto';
import { useEffect, useState } from 'react';
import { useAdminConnection } from '../../../../hooks/use-admin-connection';
import { DeleteAdminModal } from './delete-admin-modal';
import { UpdateAdminPermissionModal } from './update-admin-permission-modal';

export default function Admins() {
  const [admins, setAdmins] = useState<SearchResponseDto>([]);
  const [selectedUpdatePermissionAdminId, setSelectedUpdatePermissionAdminId] = useState<string | null>(null);
  const [selectedDeleteAdminId, setSelectedDeleteAdminId] = useState<string | null>(null);
  const connection = useAdminConnection();

  useEffect(() => {
    api.functional.api.admin.search(connection, {
      page: 1,
      size: 30,
    }).then((response) => {
      setAdmins(response);
    });
  }, []);

  return (
    <div>
      <h1 className='text-2xl font-semibold'>관리자 관리</h1>
      <table
        className='table-auto w-full mt-4'
      >
        <thead>
          <tr className='border-b border-gray-300'>
            <th></th>
            <th className='text-left font-medium'>이름</th>
            <th className='text-left font-medium'>가입일</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, idx) => (
            <tr key={admin.id} className='border-b border-gray-300'>
              <td className='pr-2'>{idx + 1}</td>
              <td className='w-full pr-2'>{admin.name}</td>
              <td className='pr-2'>{new Date(admin.joinedAt).toISOString().split('T')[0].split('-').join('/')}</td>
              <td className='flex gap-2 whitespace-nowrap align-middle py-2'>
                <button
                  className='bg-button text-white p-1 rounded-md text-sm font-medium'
                  onClick={() => setSelectedUpdatePermissionAdminId(admin.id)}
                >권한 변경</button>
                <button
                  className='bg-error text-white p-1 rounded-md text-sm font-medium'
                  onClick={() => setSelectedDeleteAdminId(admin.id)}
                >삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUpdatePermissionAdminId && <UpdateAdminPermissionModal
        adminId={selectedUpdatePermissionAdminId}
        close={() => setSelectedUpdatePermissionAdminId(null)}
      />}
      {selectedDeleteAdminId && <DeleteAdminModal
        adminName={admins.find((admin) => admin.id === selectedDeleteAdminId)?.name || ''}
        selectedDeleteAdminId={selectedDeleteAdminId}
        close={() => setSelectedDeleteAdminId(null)}
        onAdminDelete={() => {setAdmins(admins.filter((admin) => admin.id !== selectedDeleteAdminId))}}
      />}
    </div>
  );
}