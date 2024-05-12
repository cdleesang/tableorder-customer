export const SETTINGS_PASSWORD = '2388';

export const IDLE_TIME = 60 * 1000;

export const API_URL = process.env.NODE_ENV === 'production'
  ? 'http://172.30.1.1:3000'
  : 'http://172.30.1.90:3000';

export const EVENT_SLIDE_INTERVAL = 5 * 1000;