const generateAdminRoutes = () => {
  const PREFIX = '/admin';

  return {
    ADMIN_ROOT: PREFIX,
    ADMIN_SIGN_IN: `${PREFIX}/sign-in`,
    ADMIN_SIGN_UP: `${PREFIX}/sign-up`,
    ADMIN_ORDERS: `${PREFIX}/orders`,
    ADMIN_TABLES: `${PREFIX}/tables`,
    ADMIN_MY_INFO: `${PREFIX}/my-info`,
    ADMIN_ADMINS: `${PREFIX}/admins`,
  };
};

export const ROUTES = {
  EVENT_SLIDE: '/event-slide',
  MAIN: '/',
  ...generateAdminRoutes(),
};