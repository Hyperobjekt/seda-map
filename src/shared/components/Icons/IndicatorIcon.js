import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    background: theme.palette.secondary.main,
    padding: 0,
    paddingLeft: 1, // for number alignment
    fontSize: '0.825rem',
    color: theme.app.darkText,
    width: 16,
    height: 16,
    borderRadius: 16,
    lineHeight: '18px',
    textAlign: 'center',
    fontWeight: 'bold'
  }
}))

/**
 * Overlays an indicator on an icon
 */
const IndicatorIcon = ({
  children,
  indicator,
  className,
  ...props
}) => {
  const classes = useStyles()
  return (
    <div
      className={clsx(classes.root, 'indicator-icon', className)}
      {...props}>
      {children}
      <span
        className={clsx(
          classes.indicator,
          'indicator-icon__indicator'
        )}>
        {indicator}
      </span>
    </div>
  )
}

IndicatorIcon.propTypes = {}

export default IndicatorIcon
