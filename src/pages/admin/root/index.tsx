import api from '@cdleesang/tableorder-api-sdk';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useAdminConnection } from '../../../hooks/use-admin-connection';
import { ROUTES } from '../../../route/routes';
import { LocalStorage } from '../../../store/local-storage';
import { adminAccessTokenState, isAdminNavOpenState, isMobileState } from '../../../store/state';
import Navigation from './navigation';

export default function Admin() {
  const [isNavOpen, setIsNavOpen] = useRecoilState(isAdminNavOpenState);
  const [accessToken, setAccessToken] = useRecoilState(adminAccessTokenState);
  const renewTokenIntervalId = useRef<NodeJS.Timeout | null>(null);
  const connection = useAdminConnection();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useRecoilState(isMobileState);

  const renewToken = async () => {
    const refreshToken = LocalStorage.adminRefreshToken;

    if (refreshToken === null) {
      navigate(ROUTES.ADMIN_SIGN_IN);
    }
    
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await api.functional.api.auth.admin.renew_token.adminRenewToken(connection, {
        refreshToken: refreshToken!,
      });
      
      setAccessToken(newAccessToken);
      LocalStorage.adminRefreshToken = newRefreshToken;
    } catch {
      navigate(ROUTES.ADMIN_SIGN_IN);
    }
  }

  useEffect(() => {
    if(!accessToken) {
      renewToken();
    }

    renewTokenIntervalId.current = setInterval(() => {
      renewToken();
    }, 3 * 60 * 1000);

    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }

    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      if(renewTokenIntervalId.current) {
        clearInterval(renewTokenIntervalId.current);
      }

      window.removeEventListener('resize', onResize);
    };
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
        <div className={`flex-1 p-4 ${isNavOpen ? 'ml-56' : isMobile ? 'ml-0' : 'ml-16'} transition-[margin]`}>
          {accessToken && <Outlet />}
        </div>
      </div>
    </>
  );
}