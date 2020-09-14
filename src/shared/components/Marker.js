import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    border: props => `2px solid ${props.color}`,
    borderRadius: '100%',
    boxShadow: `0 0 0 1.5px #fff, inset 0 0 0 1.5px #fff`,
    width: 18,
    height: 18
  },
  label: {
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props => props.color,
    fontSize: 12,
    lineHeight: 1,
    ...theme.mixins.fillSpace,
    '&:before': {
      content: props =>
        props.label ? `"${props.label}"` : null,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: -1,
      '-webkit-text-stroke': `2.5px #fff`,
      ...theme.mixins.fillSpace
    }
  }
}))

const Marker = ({
  className,
  classes: overrides = {},
  color,
  innerColor,
  label,
  style = {},
  ...props
}) => {
  const classes = useStyles({ color, label })
  return (
    <div
      className={clsx('marker', classes.root, className)}
      style={{
        background: innerColor,
        ...style
      }}
      {...props}>
      <Typography
        variant="h6"
        component="span"
        className={clsx(
          'marker__label',
          classes.label,
          overrides.label
        )}>
        {label}
      </Typography>
    </div>
  )
}

Marker.propTypes = {
  /** color for the marker outline */
  color: PropTypes.string,
  /** color for the inside of the marker */
  innerColor: PropTypes.string,
  /** classname overrides */
  classes: PropTypes.object,
  /** classname for the root component */
  className: PropTypes.string,
  /** style object to apply to the root element */
  style: PropTypes.object
}

export default Marker
