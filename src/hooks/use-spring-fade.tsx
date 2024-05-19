import { useSpring } from '@react-spring/web';

export function useSpringFadeIn() {
  return useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });
}

export function useSpringFadeOut() {
  return useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
  });
}