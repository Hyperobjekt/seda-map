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
    bottom: 0,
    right: 0,
    background: theme.palette.secondary.main,
    padding: 0,
    fontSize: 10,
    color: theme.app.darkText,
    width: 16,
    height: 16,
    borderRadius: 16,
    lineHeight: '16px',
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
      {!!indicator && (
        <span
          className={clsx(
            classes.indicator,
            'indicator-icon__indicator'
          )}>
          {indicator}
        </span>
      )}
    </div>
  )
}

IndicatorIcon.propTypes = {
  /** text or number to display as indicator */
  indicator: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /** class name for root element */
  className: PropTypes.string
}

export default IndicatorIcon
