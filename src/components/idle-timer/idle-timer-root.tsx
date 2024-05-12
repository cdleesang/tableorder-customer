import { createContext, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { IDLE_TIME } from '../../common/constants/constant';
import { ROUTES } from '../../route/routes';
import useViewTransitionNavigate from '../../hooks/use-view-transition-navigate';

const IdleTimerRootContext = createContext(() => {});
export const useActive = () => useContext(IdleTimerRootContext);

function IdleTimerRoot({children}: {children: React.ReactNode}) {
  const setTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const navigate = useViewTransitionNavigate();
  const location = useLocation();

  function handleActive() {
    if(location.pathname === ROUTES.EVENT_SLIDE) navigate(ROUTES.MAIN);
    if(setTimeoutId.current) clearTimeout(setTimeoutId.current);

    setTimeoutId.current = setTimeout(
      () => navigate(ROUTES.EVENT_SLIDE),
      IDLE_TIME,
    );
  }

  return (
    <IdleTimerRootContext.Provider value={handleActive}>
      {children}
    </IdleTimerRootContext.Provider>
  );
}

export default IdleTimerRoot;