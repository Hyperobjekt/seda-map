import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { AboveIcon, BelowIcon } from '../../modules/icons'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  indicator: {
    fontSize: 16,
    '&.metric-value__indicator--above': {
      color: props =>
        props.invertColor
          ? theme.app.belowColorAlt
          : theme.app.aboveColorAlt
    },
    '&.metric-value__indicator--below': {
      color: props =>
        props.invertColor
          ? theme.app.aboveColorAlt
          : theme.app.belowColorAlt
    }
  },
  number: {
    fontSize: theme.typography.pxToRem(14),
    lineHeight: 1,
    color: props =>
      props.dark ? '#fff' : theme.palette.text.primary
  },
  unavailable: {
    fontSize: theme.typography.pxToRem(14),
    lineHeight: 1,
    textAlign: 'center',
    width: '100%',
    display: 'block',
    color: props =>
      props.dark ? '#fff' : theme.palette.grey[500]
  },
  marginOfError: {
    color: props =>
      props.dark
        ? 'rgba(255,255,255,0.66)'
        : theme.palette.text.secondary
  }
}))

const MetricValue = ({
  value,
  formatter = v => Math.abs(v),
  dark = false,
  marginOfError,
  mid = 0,
  invertColor = false,
  className,
  classes: overrides = {},
  ...props
}) => {
  const direction = value < mid ? 'below' : 'above'
  const classes = useStyles({ dark, invertColor })
  const isNA = value === -999
  return (
    <div
      className={clsx(
        'metric-value',
        classes.root,
        className,
        overrides.root
      )}
      {...props}>
      {!isNA && direction === 'above' && (
        <AboveIcon
          className={clsx(
            'metric-value__indicator',
            'metric-value__indicator--above',
            classes.indicator,
            overrides.indicator
          )}
        />
      )}
      {!isNA && direction === 'below' && (
        <BelowIcon
          className={clsx(
            'metric-value__indicator',
            'metric-value__indicator--below',
            classes.indicator,
            overrides.indicator
          )}
        />
      )}
      {!isNA && (
        <Typography
          variant="h6"
          component="span"
          className={clsx(
            'metric-value__number',
            classes.number,
            overrides.number
          )}>
          {formatter(value, { abs: true })}
        </Typography>
      )}
      {!isNA && marginOfError && (
        <Typography
          variant="body2"
          className={clsx(
            'metric-value__margin-of-error',
            classes.marginOfError,
            overrides.marginOfError
          )}>
          {marginOfError}
        </Typography>
      )}
      {isNA && (
        <Typography
          variant="h6"
          component="span"
          className={clsx(
            'metric-value__unavailable',
            classes.unavailable,
            overrides.unavailable
          )}>
          N/A
        </Typography>
      )}
    </div>
  )
}

MetricValue.propTypes = {
  value: PropTypes.number
}

export default MetricValue
