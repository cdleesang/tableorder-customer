import { useRecoilState } from 'recoil';
import api from '@cdleesang/tableorder-api-sdk';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { adminAccessTokenState, isAdminNavOpenState } from '../../../store/state';
import { LocalStorage } from '../../../store/local-storage';
import { ROUTES } from '../../../route/routes';
import { useAdminConnection } from '../../../hooks/use-admin-connection';
import Navigation from './navigation';

export default function Admin() {
  const [isNavOpen, setIsNavOpen] = useRecoilState(isAdminNavOpenState);
  const [accessToken, setAccessToken] = useRecoilState(adminAccessTokenState);
  const connection = useAdminConnection();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      const refreshToken = LocalStorage.adminRefreshToken;

      if (refreshToken === null) {
        navigate(ROUTES.ADMIN_SIGN_IN);
      }

      api.functional.api.auth.admin.renew_token.adminRenewToken(connection, {
        refreshToken: refreshToken!,
      }).then(response => {
        setAccessToken(response.accessToken);
        LocalStorage.adminRefreshToken = response.refreshToken;
      }).catch(() => {
        navigate(ROUTES.ADMIN_SIGN_IN);
      });
    }
  }, []);

  return (
    <>
      <div className='fixed z-10 flex w-full top-0 bg-primary px-4 py-3 text-white'>
        <div className='flex-1'>
          <FontAwesomeIcon
            className='cursor-pointer text-3xl'
            icon={faBars}
            onClick={() => setIsNavOpen(prev => !prev)}
          />
        </div>
        <span className='select-none text-2xl font-semibold'>관리자 페이지</span>
        <div className="flex-1" />
      </div>
      <div className='mt-14 flex'>
        <Navigation />
        <div className={`flex-1 p-4 absolute ${isNavOpen ? 'left-56 w-[calc(100%-14rem)]' : 'left-16 w-[calc(100%-4rem)]'} transition-[left]`}>
          <Outlet />
        </div>
      </div>
    </>
  );
}