import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { theme } from '../../modules/scatterplot/echartTheme'
import {
  AboveIcon,
  BelowIcon
} from '../../modules/seda/components/icons'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  indicator: {
    fontSize: 16,
    '&.metric-value__indicator--above': {
      color: theme.app.aboveColorAlt
    },
    '&.metric-value__indicator--below': {
      color: theme.app.belowColorAlt
    }
  },
  number: {
    fontSize: theme.typography.pxToRem(14),
    lineHeight: 1,
    color: props =>
      props.dark ? '#fff' : theme.palette.text.primary
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
  formatter = v => v,
  dark = false,
  marginOfError,
  mid = 0,
  className,
  classes: overrides = {},
  ...props
}) => {
  const direction = value < mid ? 'below' : 'above'
  const classes = useStyles({ dark })
  return (
    <div
      className={clsx(
        'metric-value',
        classes.root,
        className,
        overrides.root
      )}
      {...props}>
      {direction === 'above' && (
        <AboveIcon
          className={clsx(
            'metric-value__indicator',
            'metric-value__indicator--above',
            classes.indicator,
            overrides.indicator
          )}
        />
      )}
      {direction === 'below' && (
        <BelowIcon
          className={clsx(
            'metric-value__indicator',
            'metric-value__indicator--below',
            classes.indicator,
            overrides.indicator
          )}
        />
      )}
      <Typography
        variant="h6"
        className={clsx(
          'metric-value__number',
          classes.number,
          overrides.number
        )}>
        {formatter(value, { abs: true })}
      </Typography>
      {marginOfError && (
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
    </div>
  )
}

MetricValue.propTypes = {
  value: PropTypes.number.isRequired
}

export default MetricValue
