import api from '@cdleesang/tableorder-api-sdk';
import { useState, useEffect } from 'react';
import { useAdminConnection } from '../../../../hooks/use-admin-connection';

export function UpdateAccount() {
  const [currentSignInId, setCurrentSignInId] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const connection = useAdminConnection();

  const validate = () => {
    if(currentName === '') {
      alert('이름을 입력해주세요');
      return false;
    }

    if(currentPassword || newPassword || newPasswordConfirm) {
      if(!currentPassword || !newPassword || !newPasswordConfirm) {
        alert('비밀번호를 입력해주세요');
        return false;
      }

      if(newPassword !== newPasswordConfirm) {
        alert('새 비밀번호가 일치하지 않습니다');
        return false;
      }
    }

    return true;
  }

  const onSubmit = async () => {
    if(!validate()) {
      return;
    }


    if(currentName !== newName) {
      api.functional.api.admin.self.updateOwnProfile(connection, {
        name: newName,
      }).then(() => {
        setCurrentName(newName);
        alert('프로필이 수정되었습니다');
      });
    }

    if(currentPassword && newPassword && newPasswordConfirm) {
      api.functional.api.admin.self.password.updateOwnPassword(connection, {
        currentPassword,
        newPassword,
      }).then(() => {
        alert('비밀번호가 수정되었습니다');
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
      }).catch((err) => {
        if(err instanceof api.HttpError) {
          if(err.status === 409) {
            alert('현재 비밀번호가 일치하지 않습니다');
          }
        }
      });
    }
  }

  useEffect(() => {
    api.functional.api.admin.self.viewOwnProfile(connection).then(({signInId, name}) => {
      setCurrentSignInId(signInId);
      setCurrentName(name);
      setNewName(name);
    });
  }, []);

  return <>
    <form
      className='mt-4 p-4 border border-gray-300 rounded-md shadow-md max-w-2xl mx-auto'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className='text-lg font-semibold mb-2'>
        프로필 수정
      </h2>
      <label>
        <span className='block text-sm font-semibold my-1 text-gray-700'>아이디</span>
        <input
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary'
          type="text"
          value={currentSignInId}
          disabled
        />
      </label>
      <label>
        <span className='block text-sm font-semibold my-1 text-gray-700'>이름</span>
        <input
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary'
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
      </label>
      <hr className='my-4' />
      <h2 className='text-lg font-semibold mb-2'>
        비밀번호 변경
      </h2>
      <label>
        <span className='block text-sm font-semibold my-1 text-gray-700'>현재 비밀번호</span>
        <input
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary'
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </label>
      <label>
        <span className='block text-sm font-semibold my-1 text-gray-700'>새 비밀번호</span>
        <input
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary'
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <label>
        <span className='block text-sm font-semibold my-1 text-gray-700'>새 비밀번호 확인</span>
        <input
          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary'
          type="password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
        />
      </label>
      <button className='w-full mt-4 p-2 rounded-md bg-point text-white'>
        수정
      </button>
    </form>
    <div className='flex justify-center'>
      <button
        className='mt-4 p-2 rounded-md bg-error text-white'
        type="button"
      >
        관리자 탈퇴
      </button>
    </div>
  </>;
}