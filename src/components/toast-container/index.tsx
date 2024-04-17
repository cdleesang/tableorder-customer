import './index.scss';
import { ToastContainer as ReactToastContainer } from 'react-toastify';

function ToastContainer() {
  return <ReactToastContainer toastClassName={'toast-item'} />;
}

export default ToastContainer;