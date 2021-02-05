import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  makeStyles,
  useTheme,
  useMediaQuery
} from '@material-ui/core'
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
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
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
  const panelRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const adjustTransform =
    isMobile || !marginLeft ? '0px' : `${marginLeft}px`
  const panelStyle = useSpring({
    transform: open 
      ? `translate3d(calc(0% + ${adjustTransform}), 0, 0)`
      : `translate3d(calc(-100% + ${adjustTransform}), 0, 0)`,
    onStart: () => {
      if (!panelRef.current) return
      if (open) panelRef.current.style.visibility = 'visible'
    },
    onRest: () => {
      if (!panelRef.current) return
      open
        ? (panelRef.current.style.visibility = 'visible')
        : (panelRef.current.style.visibility = 'hidden')
    }
  })
  return (
    <AnimatedPanel
      ref={panelRef}
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
