import api from '@cdleesang/tableorder-api-sdk';
import Modal from '../../../../components/modal';
import { useAdminConnection } from '../../../../hooks/use-admin-connection';

export function DeleteAdminModal({
  adminName,
  selectedDeleteAdminId,
  close,
  onAdminDelete,
}: {
  adminName: string;
  selectedDeleteAdminId: string;
  close: () => void;
  onAdminDelete: () => void;
}) {
  const connection = useAdminConnection();

  return <Modal className='!w-2/5 min-w-64 max-w-96 !h-min text-white' close={close}>
    <h2 className='text-lg font-semibold'>관리자 삭제</h2>
    <div className='py-4'>
      <p>관리자 삭제는 되돌릴 수 없습니다.</p>
      <p><b>{adminName}</b> 관리자를 삭제하시겠습니까?</p>
    </div>
    <button
      className='bg-error text-white p-1 px-2 rounded-md font-medium block ml-auto'
      onClick={async () => {
        try {
          await api.functional.api.admin.$delete(connection, selectedDeleteAdminId);

          onAdminDelete();
          alert('관리자가 삭제되었습니다');
          close();
        } catch(err) {
          if(err instanceof api.HttpError) {
            if(err.status === 403) {
              alert('관리자 삭제 권한이 없습니다');
            }
          }
        }
      }}
    >삭제</button>
  </Modal>;
}