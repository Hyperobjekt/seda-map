import create from 'zustand'
import { getLang } from '../selectors/lang'

const useSiteStore = create(() => ({
  title: getLang('LOGO_ALT_TEXT'),
  menu: [
    {
      id: 'home',
      href: '/',
      text: getLang('MENU_HOME')
    },
    {
      id: 'explorer',
      href: '/explorer',
      text: getLang('MENU_OPPORTUNITY')
    },
    {
      id: 'discoveries',
      href: '/discoveries',
      text: getLang('MENU_DISCOVERIES')
    },
    {
      id: 'about',
      href: '/about',
      text: getLang('MENU_ABOUT')
    },
    {
      id: 'faq',
      href: '/help-faq',
      text: getLang('MENU_FAQ')
    },
    {
      id: 'methods',
      href: '/methods',
      text: getLang('MENU_METHODS')
    },
    {
      id: 'research',
      href: '/research',
      text: getLang('MENU_RESEARCH')
    },
    {
      id: 'news',
      href: '/news',
      text: getLang('MENU_NEWS')
    },
    {
      id: 'data',
      href: '/get-the-data',
      text: getLang('MENU_DATA')
    }
  ],
  social: [
    {
      id: 'facebook',
      href: '#',
      text: getLang('MENU_FACEBOOK')
    },
    {
      id: 'twitter',
      url: '#',
      label: getLang('MENU_TWITTER')
    },
    {
      id: 'linkedin',
      url: '#',
      label: getLang('MENU_LINKEDIN')
    },
    {
      id: '',
      url: '#',
      label: getLang('MENU_YOUTUBE')
    }
  ]
}))

export default useSiteStore
