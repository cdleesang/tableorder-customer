import { flushSync } from 'react-dom';
import { useNavigate, To } from 'react-router-dom';

function useViewTransitionNavigate() {
  const navigate = useNavigate();

  if(!document.startViewTransition) {
    return navigate;
  }

  return (to: To) => document.startViewTransition(
    () => flushSync(
      () => navigate(to),
    ),
  );
}

export default useViewTransitionNavigate;