import React from 'react'
import PropTypes from 'prop-types'
import { Paper, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { useSpring, animated } from 'react-spring'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: props =>
      props.condensed
        ? theme.app.condensedPanelWidth
        : theme.app.panelWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    height: '100%'
  },
  panelOpen: {}
}))

const AnimatedPanel = animated(Paper)

const SidePanel = ({
  open,
  classes: overrides,
  condensed,
  children,
  style: { marginLeft, ...styles },
  ...props
}) => {
  const classes = useStyles({ condensed })
  const panelStyle = useSpring({
    transform: open ? 'translateX(0%)' : 'translateX(-100%)',
    marginLeft: marginLeft ? marginLeft : 0
  })
  return (
    <AnimatedPanel
      square
      classes={{
        root: clsx('panel', classes.root, overrides.root, {
          [classes.panelOpen]: open,
          'panel--open': open
        })
      }}
      style={{
        ...styles,
        ...panelStyle
      }}
      {...props}>
      {children}
    </AnimatedPanel>
  )
}

SidePanel.propTypes = {
  /** Determines if the panel is full width or condensed */
  condensed: PropTypes.bool
}
SidePanel.defaultProps = {
  condensed: false,
  classes: {}
}

export default SidePanel
