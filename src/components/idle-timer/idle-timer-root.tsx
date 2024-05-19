import { createContext, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { IDLE_TIME } from '../../common/constants/constant';
import { ROUTES } from '../../route/routes';

const IdleTimerRootContext = createContext(() => {});
export const useActive = () => useContext(IdleTimerRootContext);

function IdleTimerRoot({children}: {children: React.ReactNode}) {
  const setTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  function handleActive() {
    if(location.pathname === ROUTES.EVENT_SLIDE) window.location.href = ROUTES.MAIN;
    if(setTimeoutId.current) clearTimeout(setTimeoutId.current);

    setTimeoutId.current = setTimeout(
      () => window.location.href = ROUTES.EVENT_SLIDE,
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