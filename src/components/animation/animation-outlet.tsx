import { AnimatePresence } from 'framer-motion';
import { cloneElement } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

function AnimationOutlet({children}: {children: React.ReactNode}) {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode='wait' initial={true}>
      {element && cloneElement(element, { key: location.pathname})}
    </AnimatePresence>
  );
}

export default AnimationOutlet;