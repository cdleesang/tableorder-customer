import api from '@cdleesang/tableorder-api-sdk';
import { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useAdminConnection } from '../../hooks/use-admin-connection';
import { ROUTES } from '../../route/routes';
import { LocalStorage } from '../../store/local-storage';
import { adminAccessTokenState } from '../../store/state';

export default function SignIn() {
  const [accessToken, setAccessToken] = useRecoilState(adminAccessTokenState);
  const [signInId, setSignInId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAutoSignIn, toggleIsAutoSignIn] = useReducer((prev: boolean) => !prev, false);
  const navigate = useNavigate();
  const connection = useAdminConnection();

  const onSignIn = async () => {
    try {
      const response = await api.functional.api.auth.admin.sign_in.adminSignIn(connection, {
        signInId,
        password,
      });
      setAccessToken(response.accessToken);

      if(isAutoSignIn) {
        LocalStorage.adminRefreshToken = response.refreshToken;
      }
    } catch(err) {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  useEffect(() => {
    if(accessToken) {
      navigate(ROUTES.ADMIN_ROOT);
    }
  }, [accessToken]);

  return (
    <div className='fixed left-1/2 top-1/2 w-4/5 max-w-lg -translate-x-1/2 -translate-y-1/2'>
      <form
        className='rounded-lg border border-gray-300 bg-primary p-8 shadow-lg'
        onSubmit={async e => { e.preventDefault(); await onSignIn() }}
      >
        <h1
          className='mb-14 text-center text-2xl font-bold text-white'
        >
          관리자 로그인
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
          onChange={e => setPassword(e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g, ''))}
          required
        />
        <div className='mb-4 flex w-full justify-between'>
          <label className='cursor-pointer text-white'>
            <input
              className='mr-2 cursor-pointer accent-point'
              type="checkbox"
              checked={isAutoSignIn}
              onChange={toggleIsAutoSignIn}
            />
            자동 로그인
          </label>
          <Link
            to={ROUTES.ADMIN_SIGN_UP}
            className='text-point hover:underline'
          >회원가입</Link>
        </div>
        <button
          className='mt-8 w-full cursor-pointer rounded-md bg-point p-2 text-white hover:opacity-80 transition-opacity'
        >
          로그인
        </button>
      </form>
    </div>
  );
}