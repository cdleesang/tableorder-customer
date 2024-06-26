import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './routes';

function Router() {
  const router = createBrowserRouter([
    {
      lazy: async () => ({Component: (await import('../app')).default}),
      children: [
        {
          path: ROUTES.EVENT_SLIDE,
          lazy: async () => ({Component: (await import('../pages/event-slide')).default}),
        },
        {
          path: ROUTES.MAIN,
          lazy: async () => ({Component: (await import('../pages/main')).default}),
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default Router;