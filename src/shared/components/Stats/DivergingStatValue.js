import React from 'react'
import PropTypes from 'prop-types'
import { Typography, withStyles } from '@material-ui/core'
import clsx from 'clsx'
import {
  AboveIcon as defaultAbove,
  BelowIcon as defaultBelow
} from '../../../modules/icons'

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  dark: {
    '& $number': {
      color: '#fff'
    },
    '& $unavailble': {
      color: '#fff'
    },
    '& $marginOfError': {
      color: 'rgba(255,255,255,0.66)'
    }
  },
  invert: {
    '& $indicator': {
      '&.stat-value__indicator--above': {
        color: theme.app.belowColorAlt
      },
      '&.stat-value__indicator--below': {
        color: theme.app.aboveColorAlt
      }
    }
  },
  indicator: {
    fontSize: 16,
    '&.stat-value__indicator--above': {
      color: theme.app.aboveColorAlt
    },
    '&.stat-value__indicator--below': {
      color: theme.app.belowColorAlt
    }
  },
  number: {
    fontSize: theme.typography.pxToRem(14),
    lineHeight: 1,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center'
  },
  unavailable: {
    fontSize: theme.typography.pxToRem(14),
    lineHeight: 1,
    color: theme.palette.grey[500]
  },
  marginOfError: {
    color: theme.palette.text.secondary,
    lineHeight: 1,
    marginTop: 4
  }
})

const defaultIsUnavailable = value => {
  return value === -999 || (!value && value !== 0)
}

const defaultFormatter = v => Math.abs(v)

/**
 * Displays a stat value with an above / below indicator based on the value, with an optional margin of error
 */
const DivergingStatValue = ({
  className,
  classes,
  value,
  unavailableValue = 'N/A',
  marginOfError,
  mid = 0,
  dark = false,
  invertColor = false,
  AboveIcon = defaultAbove,
  BelowIcon = defaultBelow,
  formatter = defaultFormatter,
  isUnavailable = defaultIsUnavailable,
  ...props
}) => {
  const direction = value < mid ? 'below' : 'above'
  const isNA = isUnavailable(value)
  return (
    <div
      className={clsx(
        'stat-value',
        classes.root,
        {
          [classes.dark]: dark,
          [classes.invert]: invertColor
        },
        className
      )}
      {...props}>
      {!isNA && (
        <Typography
          variant="h6"
          component="span"
          className={clsx('stat-value__number', classes.number)}>
          {direction === 'above' && (
            <AboveIcon
              className={clsx(
                'stat-value__indicator',
                'stat-value__indicator--above',
                classes.indicator
              )}
            />
          )}
          {direction === 'below' && (
            <BelowIcon
              className={clsx(
                'stat-value__indicator',
                'stat-value__indicator--below',
                classes.indicator
              )}
            />
          )}
          {formatter(value, { abs: true })}
        </Typography>
      )}
      {!isNA && marginOfError && (
        <Typography
          variant="body2"
          className={clsx(
            'stat-value__marginOfError',
            classes.marginOfError
          )}>
          ± {marginOfError}
        </Typography>
      )}
      {isNA && (
        <Typography
          variant="h6"
          component="span"
          className={clsx(
            'stat-value__unavailable',
            classes.unavailable
          )}>
          {unavailableValue}
        </Typography>
      )}
    </div>
  )
}

DivergingStatValue.propTypes = {
  /** Value for the stat */
  value: PropTypes.number,
  /** function to format the value for display */
  formatter: PropTypes.func,
  /** boolean indicating if it should render dark background variant */
  dark: PropTypes.bool,
  /** margin of error for the value */
  marginOfError: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  /** mid point for this stat */
  mid: PropTypes.number,
  /** boolean indicating if the color should be inverted */
  invertColor: PropTypes.bool,
  /** function that returns a boolean indicating if the value is N/A or not */
  isUnavailable: PropTypes.func,
  /** class name for the root of the component */
  className: PropTypes.string,
  /** class names for elements within the component */
  classes: PropTypes.object,
  /** string to display when value is unavailable */
  unavailableValue: PropTypes.string,
  /** icon to use for stats above the midpoint */
  AboveIcon: PropTypes.node,
  /** icon to use for stats below the midpoint */
  BelowIcon: PropTypes.node
}

export default withStyles(styles)(DivergingStatValue)
