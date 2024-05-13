import { useEffect } from 'react';
import { Observer, SSE } from '../sse/sse';

function useSSE(observer: Observer) {
  useEffect(() => {
    SSE.subscribe(observer);
    
    return () => {
      SSE.unsubscribe(observer);
    }
  }, []);
}

export default useSSE;