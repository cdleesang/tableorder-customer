import { Suspense, lazy, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import IdleTimer from '../../components/idle-timer/idle-timer';
import { openedCategoriesState } from '../../store/state';
import Cart from './cart';
import './index.scss';
import MenuList from './menu-list';
import Navigation from './navigation';
import { useActive } from '../../components/idle-timer/idle-timer-root';

const MenuModal = lazy(() => import('./menu-modal'));

function Main() {
  const [searchParams] = useSearchParams();
  const currentMenuId = searchParams.get('menuId');
  const setOpenedCategories = useSetRecoilState(openedCategoriesState);
  const active = useActive();

  useEffect(() => {
    active();
    setOpenedCategories({});
  }, []);

  return (
    <IdleTimer className='main'>
      <Navigation />
      <MenuList />
      <Cart />
      {currentMenuId && <Suspense fallback={null}><MenuModal /></Suspense>}
    </IdleTimer>
  );
}

export default Main;