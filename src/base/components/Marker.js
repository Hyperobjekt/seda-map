import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    border: props => `2px solid ${props.color}`,
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)',
    boxShadow: `0 0 0 1.5px #fff, inset 0 0 0 1.5px #fff`
  },
  label: {
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props => props.color,
    fontSize: 14,
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

const BaseMarker = ({
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

BaseMarker.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object
}

export default BaseMarker
