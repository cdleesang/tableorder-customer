import { Slide, toast as reactToast } from 'react-toastify';
import { v4 as uuidV4 } from 'uuid';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export function toast(
  type: ToastType,
  message: string,
  options: {
    isInfinite?: boolean,
    isFlicker?: boolean,
    onClose?: () => void,
  } = {}
) {
  return reactToast[type](message, {
    position: 'top-right',
    autoClose: options?.isInfinite ? false : 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    transition: Slide,
    toastId: `${uuidV4()} ${options?.isFlicker ? 'flicker' : undefined}`,
    onClose: options?.onClose,
  });
}

export function dismissToast(id?: string | number) {
  reactToast.dismiss(id);
}

export const isToastActive = reactToast.isActive;