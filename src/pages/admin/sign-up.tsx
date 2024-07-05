import api from '@cdleesang/tableorder-api-sdk';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminConnection } from '../../hooks/use-admin-connection';
import { ROUTES } from '../../route/routes';

export default function SignUp() {
  const [signInId, setSignInId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const connection = useAdminConnection();
  const navigate = useNavigate();

  const validate = () => {
    if(password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const onSignUp = async () => {
    try {
      await api.functional.api.admin.sign_up.signUp(connection, {
        signInId,
        password,
        name,
      });
      navigate(ROUTES.ADMIN_SIGN_IN);
    } catch(err) {
      if(err instanceof api.HttpError) {
        if(err.status === 409) {
          alert('이미 사용중인 아이디입니다.');
          return;
        }
      }

      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className='fixed left-1/2 top-1/2 w-4/5 max-w-lg -translate-x-1/2 -translate-y-1/2'>
      <form
        className='rounded-lg border border-gray-300 bg-primary p-8 shadow-lg'
        onSubmit={async e => {
          e.preventDefault();
          if(validate()) {
            await onSignUp();
          }
        }}
      >
        <h1
          className='mb-14 text-center text-2xl font-bold text-white'
        >
          관리자 회원가입
        </h1>
        <input
          className='mb-4 w-full rounded-md border border-gray-300 p-2'
          type="text"
          placeholder="아이디"
          value={signInId}
          onChange={e => setSignInId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
          required
        />
        <input
          className='mb-4 w-full rounded-md border border-gray-300 p-2'
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => { setPassword(e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g, '')) }}
          required
        />
        <input
          className='mb-4 w-full rounded-md border border-gray-300 p-2'
          type="password"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g, ''))}
          required
        />
        <input
          className='mb-4 w-full rounded-md border border-gray-300 p-2'
          type="text"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button
          className='mt-8 w-full cursor-pointer rounded-md bg-point p-2 text-white hover:opacity-80 transition-opacity'
        >
          회원가입
        </button>
      </form>
    </div>
  );
}