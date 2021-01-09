import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import { Marker } from '../../../../shared'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  primary: {
    display: 'flex',
    fontSize: props =>
      props.small
        ? theme.typography.body2.fontSize
        : theme.typography.pxToRem(13)
  },
  secondary: {
    color: theme.palette.text.secondary
  },

  marker: {
    '& .marker__label': { fontSize: 12 }
  },
  markerInline: {
    marginLeft: theme.spacing(1),
    marginTop: 2
  },
  markerLeft: {
    marginRight: 10
  }
}))

/**
 * Displays location name, parent location, and marker (optional) for a location
 * TODO: generic, move to shared module or location module
 */
const LocationName = ({
  name,
  parentLocation,
  label,
  color,
  markerPosition = 'inline',
  small,
  className,
  ...props
}) => {
  const hasLabel = label || label === 0
  const classes = useStyles({ small })
  const marker = hasLabel && color && (
    <Marker
      className={clsx('location-name__marker', classes.marker, {
        [classes.markerInline]: markerPosition === 'inline',
        [classes.markerLeft]: markerPosition === 'left'
      })}
      label={label}
      color={color}
    />
  )
  return (
    <div
      className={clsx('location-name', classes.root, className)}
      {...props}>
      {markerPosition === 'left' && marker}
      <div className="location-name__text">
        <Typography className={classes.primary} variant="h6">
          {name} {markerPosition === 'inline' && marker}
        </Typography>
        <Typography
          className={classes.secondary}
          variant="body2">
          {parentLocation}
        </Typography>
      </div>
    </div>
  )
}

LocationName.propTypes = {
  /** name of the location */
  name: PropTypes.string,
  /** parent location (e.g. state name) */
  parentLocation: PropTypes.string,
  /** label for the marker */
  label: PropTypes.any,
  /** color for marker */
  color: PropTypes.string,
  /** marker position (`"inline"` or `"left"`) */
  markerPosition: PropTypes.string,
  /** use small variant of location name */
  small: PropTypes.bool,
  /** class name for root */
  className: PropTypes.string
}

export default LocationName
