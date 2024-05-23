import { createContext, useContext, useRef } from 'react';
import { IDLE_TIME } from '../../common/constants/constant';
import { ROUTES } from '../../route/routes';

const IdleTimerRootContext = createContext(() => {});
export const useActive = () => useContext(IdleTimerRootContext);

function IdleTimerRoot({children}: {children: React.ReactNode}) {
  const setTimeoutId = useRef<NodeJS.Timeout | null>(null);

  function handleActive() {
    if(setTimeoutId.current) {
      clearTimeout(setTimeoutId.current);
    }

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