import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    padding: `0 ${theme.spacing(3)}px`
  },
  branding: {
    display: 'flex',
    alignItems: 'center'
  },
  copyright: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: theme.spacing(2)
  },
  links: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const Footer = ({
  branding,
  copyright,
  links,
  classes: overrides = {},
  children,
  ...props
}) => {
  const classes = useStyles()
  return (
    <footer
      className={clsx('footer', classes.root, overrides.root)}
      {...props}>
      <div
        className={clsx(
          'footer__branding',
          classes.branding,
          overrides.branding
        )}>
        {branding}
      </div>
      <div
        className={clsx(
          'footer__copyright',
          classes.copyright,
          overrides.copyright
        )}>
        {copyright}
      </div>
      <div
        className={clsx(
          'footer__links',
          classes.links,
          overrides.links
        )}>
        {links}
      </div>
      {children}
    </footer>
  )
}

Footer.propTypes = {
  copyright: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  branding: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  links: PropTypes.node
}

export default Footer
