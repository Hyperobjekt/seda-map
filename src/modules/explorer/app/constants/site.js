import LANG from './en'

/** breakpoint where help switches from footer to header */
export const HELP_BREAKPOINT = 1280

export const FOOTER = {
  branding: {
    url: '#',
    alt: 'Stanford',
    imgSrc: 'https://placehold.it/200x40'
  },
  links: [
    {
      id: 'export',
      label: 'Export',
      items: [
        {
          id: 'facebook',
          label: LANG['FOOTER_SHARE_FACEBOOK']
        },
        {
          id: 'twitter',
          label: LANG['FOOTER_SHARE_TWITTER']
        },
        {
          id: 'link',
          label: LANG['FOOTER_SHARE_LINK']
        }
      ]
    },
    {
      id: 'share',
      label: 'Share',
      items: [
        {
          id: 'pdf',
          label: LANG['FOOTER_EXPORT_PDF']
        },
        {
          id: 'ppt',
          label: LANG['FOOTER_EXPORT_PPT']
        }
      ]
    }
  ],
  copyright: LANG['FOOTER_COPYRIGHT']
}

export const MENU = {
  navItems: [
    {
      id: 'home',
      url: '/',
      label: LANG['MENU_HOME']
    },
    {
      id: 'explorer',
      url: '/explorer',
      label: LANG['MENU_OPPORTUNITY']
    },
    {
      id: 'discoveries',
      url: '/discoveries',
      label: LANG['MENU_DISCOVERIES']
    },
    {
      id: 'about',
      url: '/about',
      label: LANG['MENU_ABOUT']
    },
    {
      id: 'faq',
      url: '/help-faq',
      label: LANG['MENU_FAQ']
    },
    {
      id: 'methods',
      url: '/methods',
      label: LANG['MENU_METHODS']
    },
    {
      id: 'research',
      url: '/research',
      label: LANG['MENU_RESEARCH']
    },
    {
      id: 'news',
      url: '/news',
      label: LANG['MENU_NEWS']
    },
    {
      id: 'data',
      url: '/get-the-data',
      label: LANG['MENU_DATA']
    }
  ],
  socialItems: [
    {
      id: 'facebook',
      url: 'https://www.facebook.com/edopportunity/',
      label: LANG['MENU_FACEBOOK'],
      icon: 'facebook'
    },
    {
      id: 'twitter',
      url: 'https://twitter.com/seda_data',
      label: LANG['MENU_TWITTER'],
      icon: 'twitter'
    }
  ]
}
