import React from 'react'
import {
  makeStyles,
  Button,
  Drawer,
  Link
} from '@material-ui/core'
import useMenuVisibility from './useMenuVisibility'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { FacebookIcon, TwitterIcon } from '../../icons'
import { MENU } from '../app/constants/site.js'
//import { useSiteStore } from '../app/hooks'

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center'
    },
    [theme.breakpoints.up('sm')]: {
      textAlign: 'left'
    },
    '& .MuiIconButton-root': {
      borderRadius: '50%'
    }
  },
  panelPaper: {
    width: 320,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: theme.spacing(1),
    textAlign: 'right'
  },
  closeIcon: {
    fill: theme.palette.text.primary,
    width: '44px',
    height: '44px'
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    width: '44px',
    height: '44px'
  },
  closeText: {
    fontFamily: 'var(--alt-font)',
    fontSize: '11.5px',
    color: 'var(--text)',
    position: 'absolute',
    bottom: '-5px',
    left: '0',
    right: '0',
    textAlign: 'center',
    width: '100%',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  linkBox: {
    padding: theme.spacing(15.5, 3, 3, 6)
  },
  linkItem: {
    display: 'block',
    marginBottom: theme.spacing(4),
    fontFamily: theme.typography.button.fontFamily,
    fontSize: '1.5rem',
    lineHeight: '0.85',
    textTransform: 'uppercase',
    letterSpacing: '.01rem',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  footer: {
    padding: theme.spacing(0, 5, 3, 5)
  },
  footerItem: {
    padding: 0,
    minWidth: 0,
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: theme.spacing(4)
    }
  }
}))

const links = MENU.navItems
const socials = MENU.socialItems
const socialIcons = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />
}

const MenuLinks = ({ links, classes = {}, ...props }) => (
  <div className={classes.root}>
    {Boolean(links.length) &&
      links.map((item, i) => (
        <Link
          key={i}
          className={classes.item} 
          aria-label={item.label}
          href={item.url}>
          {item.label}
        </Link>
      ))}
  </div>
)

const MenuFooter = ({
  socials,
  icons,
  classes = {},
  ...props
}) => (
  <div className={classes.root}>
    {Boolean(socials.length) &&
      socials.map((item, i) => (
        <Button
          key={i}
          className={classes.item} 
          aria-label={item.label}
          target="_blank"
          href={item.url}>
          {item.icon ? icons[item.icon] : item.label}
        </Button>
      ))}
  </div>
)

const SedaMenu = ({ ...props }) => {
  const classes = useStyles()
  //const links = useSiteStore(state => state.menu)
  const [showMenu, toggleMenu] = useMenuVisibility()
  return (
    <Drawer
      open={showMenu}
      anchor="right"
      classes={{ root: classes.root, paper: classes.panelPaper }}
      {...props}>
      <IconButton
        className={classes.closeButton}
        size="small"
        aria-label="close"
        onClick={toggleMenu}
        {...props}>
        <CloseIcon className={classes.closeIcon} />
        <span className={classes.closeText}>Close</span>
      </IconButton>
      <div className={classes.linkBox}>
        {
          <MenuLinks
            classes={{
              item: classes.linkItem,
              link: classes.link
            }}
            links={links}
          />
        }
      </div>
      <div className={classes.footer}>
        <MenuFooter
          classes={{
            item: classes.footerItem
          }}
          socials={socials}
          icons={socialIcons}
        />
      </div>
    </Drawer>
  )
}

export default SedaMenu
