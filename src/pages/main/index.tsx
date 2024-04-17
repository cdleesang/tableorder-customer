import { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Cart from './cart';
import Header from './header';
import MenuList from './menu-list';
import Navigation from './navigation';
import { isIdleState, currentViewMenuIdState, isOrderHistoryModalOpenState, openedCategoriesState } from '../../store/state';
import './index.scss';
import MenuModal from './menu-modal';
import OrderHistoryModal from './order-history-modal';
import { IDLE_TIME } from '../../constants/constant';

function Main() {
  const isMenuModalOpen = useRecoilValue(currentViewMenuIdState);
  const isOrderHistoryModalOpen = useRecoilValue(isOrderHistoryModalOpenState);
  const [isIdle, setIsIdle] = useRecoilState(isIdleState);
  const setTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const setOpenedCategories = useSetRecoilState(openedCategoriesState);

  const handleActive = () => {
    setIsIdle(false);
    if(setTimeoutId.current) clearTimeout(setTimeoutId.current);

    setTimeoutId.current = setTimeout(
      () => {
        setIsIdle(true);
        setOpenedCategories({});
      },
      IDLE_TIME,
    );
  }

  useEffect(() => {
    if(!isIdle) handleActive();
  }, [isIdle]);

  return (
    <div
      className="main"
      onClick={handleActive}
      onMouseMove={handleActive}
      onKeyDown={handleActive}
      onWheel={handleActive}
      onScroll={handleActive}
      onMouseDown={handleActive}
      onTouchStart={handleActive}
      onTouchMove={handleActive}
      onPointerDown={handleActive}
      onPointerMove={handleActive}
      onFocus={handleActive}
    >
      <Header />
      <section>
        <Navigation />
        <MenuList />
        <Cart />
        {/* 여기에 주문내역 모달 추가 */}
        {isOrderHistoryModalOpen && <OrderHistoryModal />}
        {isMenuModalOpen !== undefined && <MenuModal />}
      </section>
    </div>
  );
}

export default Main;