import React from 'react'
import PropTypes from 'prop-types'
import { Paper, Typography, withStyles } from '@material-ui/core'
import clsx from 'clsx'
import { GradientLegend } from '../../../shared'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  horizontal: {
    flexDirection: 'row',
    '& $description': {
      margin: `0 24px 0 0`
    }
  },
  description: {
    // minWidth: theme.spacing(30),
    margin: `0 0 4px 0`
  },
  primary: {
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'capitalize',
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(14)
    }
  },
  secondary: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.text.secondary,
    whiteSpace: 'normal',
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(12)
    }
  },
  gradient: {
    marginTop: theme.spacing(0.5),
    minWidth: theme.spacing(18),
    maxWidth: theme.spacing(25)
  }
})

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
  classes,
  footer
}) => {
  return (
    <Paper
      className={clsx('map-legend', className, classes.root, {
        [classes.horizontal]: layout !== 'vertical'
      })}
      elevation={1}>
      <div
        className={clsx(
          'map-legend__description',
          classes.description
        )}>
        {primary && (
          <Typography
            className={clsx(
              'map-legend__primary',
              classes.primary
            )}
            variant="body1">
            {primary}
          </Typography>
        )}
        {secondary && (
          <Typography
            className={clsx(
              'map-legend__secondary',
              classes.secondary
            )}
            variant="body2">
            {secondary}
          </Typography>
        )}
      </div>

      <GradientLegend
        className={clsx(
          'map-legend__gradient',
          classes.gradient
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
          className={clsx('map-legend__footer', classes.footer)}>
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

export default withStyles(styles)(MapLegend)
