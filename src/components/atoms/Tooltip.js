import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Typography, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { useSpring, animated } from 'react-spring'

const tooltipWidth = 304
const tooltipMargin = 16

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: theme.palette.common.black,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    width: tooltipWidth,
    padding: theme.spacing(1),
    zIndex: theme.zIndex.tooltip,
    pointerEvents: 'none'
  },
  title: {
    fontSize: theme.typography.body1.fontSize
  },
  subtitle: {}
}))

const Tooltip = ({
  title,
  subtitle,
  children,
  x,
  y,
  show = 0,
  bounds = [0, 0, window.innerWidth, window.innerHeight],
  classes: overrides
}) => {
  const elRef = useRef(null)
  const elRect = elRef.current
    ? elRef.current.getBoundingClientRect()
    : { height: 0 }
  const onRight = x + tooltipWidth + tooltipMargin < bounds[2]
  const xOffset = onRight
    ? tooltipMargin
    : -tooltipWidth - tooltipMargin
  const onBottom = y + elRect.height + tooltipMargin < bounds[3]
  const yOffset = onBottom
    ? tooltipMargin
    : bounds[3] - (y + elRect.height + tooltipMargin)
  const props = useSpring({
    transform: `translate3d(${x + xOffset}px,${y +
      yOffset}px,0)`,
    opacity: show ? 1 : 0
  })
  const classes = useStyles()
  return (
    <animated.div
      className={clsx('tooltip', classes.root, overrides.root)}
      style={props}
      ref={elRef}>
      <div className="tooltip__header">
        {title && (
          <Typography
            variant="h6"
            className={clsx(
              'tooltip__title',
              classes.title,
              overrides.title
            )}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="body1"
            className={clsx(
              'tooltip__subtitle',
              classes.subtitle,
              overrides.subtitle
            )}>
            {subtitle}
          </Typography>
        )}
      </div>
      <div
        className={clsx(
          'tooltip__content',
          classes.content,
          overrides.content
        )}>
        {children}
      </div>
    </animated.div>
  )
}

Tooltip.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  x: PropTypes.number,
  y: PropTypes.number,
  above: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  left: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  offset: PropTypes.object
}

Tooltip.defaultProps = {
  classes: {}
}

export default Tooltip
