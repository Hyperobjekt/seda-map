import React from 'react'
import PropTypes from 'prop-types'
import { Paper, Typography, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import GradientLegend from '../../../base/components/GradientLegend'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: props =>
      props.layout === 'vertical' ? 'column' : 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  description: {
    // minWidth: theme.spacing(30),
    margin: props =>
      props.layout === 'vertical' ? `0 0 4px 0` : `0 24px 0 0`
  },
  primary: {
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'capitalize'
  },
  secondary: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.text.secondary
    // whiteSpace: 'initial'
  },
  gradient: {
    marginTop: theme.spacing(0.5),
    minWidth: theme.spacing(18)
  }
}))

const MapLegend = ({
  layout,
  primary,
  secondary,
  labelRange,
  labelFormatter,
  colorRange,
  midLabel,
  colors,
  midPosition,
  markerPosition,
  className,
  classes: overrides,
  footer
}) => {
  const classes = useStyles({ layout })
  return (
    <Paper
      className={clsx(
        'map-legend',
        className,
        classes.root,
        overrides.root
      )}
      elevation={1}>
      <div
        className={clsx(
          'map-legend__description',
          classes.description,
          overrides.description
        )}>
        {primary && (
          <Typography
            className={clsx(
              'map-legend__primary',
              classes.primary,
              overrides.primary
            )}
            variant="body1">
            {primary}
          </Typography>
        )}
        {secondary && (
          <Typography
            className={clsx(
              'map-legend__secondary',
              classes.secondary,
              overrides.secondary
            )}
            variant="body2">
            {secondary}
          </Typography>
        )}
      </div>

      <GradientLegend
        className={clsx(
          'map-legend__gradient',
          classes.gradient,
          overrides.description
        )}
        {...{
          labelRange,
          labelFormatter,
          colorRange,
          colors,
          markerPosition,
          midLabel,
          midPosition
        }}
      />
      {footer && (
        <div
          className={clsx(
            'map-legend__footer',
            classes.footer,
            overrides.footer
          )}>
          {footer}
        </div>
      )}
    </Paper>
  )
}

MapLegend.defaultProps = {
  classes: {},
  layout: 'horizontal',
  markerFormatter: v => v
}

MapLegend.propTypes = {
  layout: PropTypes.string,
  primary: PropTypes.string,
  secondary: PropTypes.string,
  labelRange: PropTypes.array,
  labelFormatter: PropTypes.func,
  colorRange: PropTypes.array,
  midLabel: PropTypes.string,
  colors: PropTypes.array,
  midPosition: PropTypes.number,
  markerPosition: PropTypes.number,
  className: PropTypes.string,
  classes: PropTypes.object,
  footer: PropTypes.node
}

export default MapLegend
