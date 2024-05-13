import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './routes';
import EventSlide from '../pages/event-slide';
import Main from '../pages/main';
import App from '../app';

function Router() {
  const router = createBrowserRouter([
    {
      element: <App />,
      children: [
        {
          path: ROUTES.EVENT_SLIDE,
          element: <EventSlide />
        },
        {
          path: ROUTES.MAIN,
          element: <Main />
        }
      ]
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default Router;