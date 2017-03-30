import { TITLE, DESCRIPTION, LANG } from './index';
import { EM_DASH } from './chars';

export const APP_META_DATA = {
  htmlAttributes: { lang: `${LANG}` },
  defaultTitle: `${TITLE} ${EM_DASH} ${DESCRIPTION}`,
  title: `${DESCRIPTION}`,
  titleTemplate: `${TITLE} ${EM_DASH} %s`,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'x-ua-compatible', content: 'ie=edge' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#5476a4' },
    { name: 'description', content: DESCRIPTION },
  ],
  link: [
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '#' },
    { rel: 'apple-touch-icon', sizes: '72x72', href: '#' },
  ],
  base: { href: '#' },
};
