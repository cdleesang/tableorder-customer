import { faArrowRightFromBracket, faReceipt, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { MdTableRestaurant } from 'react-icons/md';
import { adminAccessTokenState, isAdminNavOpenState } from '../../../store/state';
import { ROUTES } from '../../../route/routes';
import { useState } from 'react';
import Modal from '../../../components/modal';
import api from '@cdleesang/tableorder-api-sdk';
import { useAdminConnection } from '../../../hooks/use-admin-connection';
import { LocalStorage } from '../../../store/local-storage';

const NAVIGATION_ITEMS: Array<{
  title: string;
  href: string;
  icon: JSX.Element;
}> = [
  {
    title: '내 정보 관리',
    href: ROUTES.ADMIN_MY_INFO,
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    title: '관리자 관리',
    href: ROUTES.ADMIN_ADMINS,
    icon: <FontAwesomeIcon icon={faUsers} />,
  },
  {
    title: '테이블 관리',
    href: ROUTES.ADMIN_TABLES,
    icon: <MdTableRestaurant style={{ display: 'inline-block' }} />,
  },
  {
    title: '현재 주문내역 보기',
    href: ROUTES.ADMIN_ORDERS,
    icon: <FontAwesomeIcon icon={faReceipt} />,
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useRecoilState(isAdminNavOpenState);
  const setAccessToken = useSetRecoilState(adminAccessTokenState);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const connection = useAdminConnection();

  return (
    <>
      <div className={`fixed overflow-hidden ${isOpen ? 'w-56' : 'w-16'} top-0 flex h-screen max-w-full flex-col justify-between bg-secondary text-white py-3 pt-12 transition-[width]`}>
        <div className="my-4 flex flex-1 flex-col overflow-y-auto">
          {
            NAVIGATION_ITEMS.map(({ title, href, icon }, idx) => (
              <Link
                key={idx}
                to={href}
                onClick={() => setIsOpen(false)}
                className={`flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden whitespace-nowrap px-4 py-8 text-lg leading-8 transition-colors hover:text-point ${location.pathname === href ? 'bg-neutral-500' : ''}`}
              >
                <span className='min-w-8 text-center text-lg'>
                  {icon}
                </span>
                <span className={'ml-2 flex-1'}>{title}</span>
              </Link>
            ))
          }
        </div>
        <div
          className={'flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden whitespace-nowrap px-4 py-8 text-lg leading-8  transition-colors hover:text-point'}
          onClick={() => setIsSignOutModalOpen(true)}
        >
          <span className='min-w-8 text-center text-lg'>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </span>
          <span className={'ml-2 flex-1'}>로그아웃</span>
        </div>
        {
          isSignOutModalOpen &&
            <Modal
              className='!w-2/5 min-w-64 max-w-96 !h-min z-30'
              close={() => setIsSignOutModalOpen(false)}
            >
              <div className='p-4'>
                <span className='text-lg font-semibold'>로그아웃 할까요?</span>
                <button
                  className='w-full p-2 mt-10  mb-2 rounded-md bg-point text-white'
                  onClick={() => {
                    api.functional.api.auth.admin.sign_out.adminSignOut(connection, {
                      refreshToken: LocalStorage.adminRefreshToken || '',
                    })
                      .then(() => {})
                      .catch(() => {})
                      .finally(() => {
                        setAccessToken(undefined);
                        LocalStorage.adminRefreshToken = null;
                        navigate(ROUTES.ADMIN_SIGN_IN);
                      });
                  }}
                >
                  로그아웃
                </button>
                <button
                  className='w-full p-2 rounded-md bg-button text-white'
                  onClick={async () => {
                    const confirm = window.confirm('현재 계정으로 로그인된\n모든 기기에서 로그아웃됩니다.\n\n계속하시겠습니까?');

                    if(confirm) {
                      api.functional.api.auth.admin.sign_out.all.adminSignOutAll(connection)
                        .then(() => {})
                        .catch(() => {})
                        .finally(() => {
                          setAccessToken(undefined);
                          LocalStorage.adminRefreshToken = null;
                          navigate(ROUTES.ADMIN_SIGN_IN);
                        });
                    }
                  }}
                >
                  모든 기기에서 로그아웃
                </button>
              </div>
            </Modal>
        }
      </div>
    </>
  );
}