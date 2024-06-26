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
    {
      path: ROUTES.ADMIN_ROOT,
      children: [
        {
          // element: <Admin />,
          lazy: async () => ({Component: (await import('../pages/admin/root')).default}),
          path: ROUTES.ADMIN_ROOT,
          children: [
            {
              // element: <AdminMyInfo />,
              lazy: async () => ({Component: (await import('../pages/admin/root/my-info')).default}),
              path: ROUTES.ADMIN_MY_INFO,
            },
            {
              // element: <AdminAdmins />,
              lazy: async () => ({Component: (await import('../pages/admin/root/admins')).default}),
              path: ROUTES.ADMIN_ADMINS,
            },
            {
              // element: <AdminTables />,
              lazy: async () => ({Component: (await import('../pages/admin/root/tables')).default}),
              path: ROUTES.ADMIN_TABLES,
            },
            {
              // element: <AdminOrders />,
              lazy: async () => ({Component: (await import('../pages/admin/root/orders')).default}),
              path: ROUTES.ADMIN_ORDERS,
            },
          ],
        },
        {
          // element: <AdminSignIn />,
          lazy: async () => ({Component: (await import('../pages/admin/sign-in')).default}),
          path: ROUTES.ADMIN_SIGN_IN,
        },
        {
          // element: <AdminSignUp />,
          lazy: async () => ({Component: (await import('../pages/admin/sign-up')).default}),
          path: ROUTES.ADMIN_SIGN_UP,
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default Router;