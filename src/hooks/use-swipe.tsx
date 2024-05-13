import { useState } from 'react';

function useSwipe() {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (event: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(event.touches[0].clientX);
  }

  const onTouchMove = (event: React.TouchEvent) => {
    setTouchEnd(event.touches[0].clientX);
  }

  const onTouchEnd = (
    callback: (isLeftSwipe: boolean, isRightSwipe: boolean) => void,
    sensitivity: number = 0,
  ) => {
    if(!(touchStart && touchEnd)) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > sensitivity;
    const isRightSwipe = distance < -sensitivity;

    if(isLeftSwipe || isRightSwipe) {
      callback(isLeftSwipe, isRightSwipe);
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}

export default useSwipe;