import React from 'react'
import { makeStyles, Button, Drawer, Link } from '@material-ui/core'
import useMenuVisibility from './useMenuVisibility'
import clsx from 'clsx'

import { MENU } from '../app/constants/site.js'
// import { useSiteStore } from '../app/hooks'

const useStyles = makeStyles(theme => ({
  root: { 
    width: theme.app.panelWidth 
  },
  panelPaper: {
    padding: theme.spacing(3),
    width: theme.app.panelWidth
  },
  linkRoot: {},
  linkItem: {
    display: 'block',
    margin: '48px 0 48px',
    fontFamily: theme.typography.button.fontFamily,
    fontSize: '1.5rem',
    lineHeight: '0.85',
    textTransform: 'uppercase',
    letterSpacing: '.01rem',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
  link: {},
}))

const links = MENU.navItems;

const MenuLinks = ({
  links,
  classes = {},
  ...props
}) => (
  <div
    className={clsx(
      'menu__link-collection',
      classes.linkCollection
    )}
    {...props}>
    {Boolean(links.length) &&
      links.map((item, i) => (
          <Link
            className={classes.item}
            aria-label={item.label}
            href={item.url}>
            {item.label}
          </Link>
      ))}
  </div>
)

const SedaMenu = ({ ...props }) => {
  const classes = useStyles()
  // const links = useSiteStore(state => state.menu)
  const [showMenu, toggleMenu] = useMenuVisibility()
  return (
    <Drawer
      open={showMenu}
      anchor="right"
      classes={{ root: classes.root, paper: classes.panelPaper }}
      {...props}>
      <div className={classes.header}>
        <Button onClick={toggleMenu}>Close</Button>
      </div>
      { <MenuLinks
        classes={{
          root: classes.linkRoot,
          item: classes.linkItem,
          link: classes.link
        }}
        links={links}
      /> }
    </Drawer>
  )
}

export default SedaMenu
