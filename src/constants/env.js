export const ENV = process.env.NODE_ENV;
export const PROD_ENV = ENV === 'production';
export const DEV_ENV = !PROD_ENV;
