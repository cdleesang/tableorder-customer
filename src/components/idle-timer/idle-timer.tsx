import { useActive } from './idle-timer-root';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function IdleTimer({children, className}: Props) {
  const active = useActive();
  
  return (
    <div
      className={className}
      onClick={active}
      onMouseMove={active}
      onKeyDown={active}
      onWheel={active}
      onScroll={active}
      onMouseDown={active}
      onTouchStart={active}
      onTouchMove={active}
      onPointerDown={active}
      onPointerMove={active}
      onFocus={active}
    >
      {children}
    </div>
  );
}

export default IdleTimer;