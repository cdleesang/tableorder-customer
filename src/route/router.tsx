import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
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
        }
      ],
    },
    {
      path: ROUTES.ADMIN_ROOT,
      children: [
        {
          path: ROUTES.ADMIN_ROOT,
          lazy: async () => ({Component: (await import('../pages/admin/root')).default}),
          children: [
            {
              index: true,
              element: <Navigate to={ROUTES.ADMIN_MY_INFO} />,
            },
            {
              path: ROUTES.ADMIN_MY_INFO,
              lazy: async () => ({Component: (await import('../pages/admin/root/my-info')).default}),
            },
            {
              path: ROUTES.ADMIN_ADMINS,
              lazy: async () => ({Component: (await import('../pages/admin/root/admins')).default}),
            },
            {
              path: ROUTES.ADMIN_TABLES,
              lazy: async () => ({Component: (await import('../pages/admin/root/tables')).default}),
            },
            {
              path: ROUTES.ADMIN_ORDERS,
              lazy: async () => ({Component: (await import('../pages/admin/root/orders')).default}),
            },
          ],
        },
        {
          path: ROUTES.ADMIN_SIGN_IN,
          lazy: async () => ({Component: (await import('../pages/admin/sign-in')).default}),
        },
        {
          path: ROUTES.ADMIN_SIGN_UP,
          lazy: async () => ({Component: (await import('../pages/admin/sign-up')).default}),
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default Router;