import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import Marker from '../../../../base/components/Marker'

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
  const classes = useStyles({ small })
  const marker = label && color && (
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
  /** label for the location */
  label: PropTypes.string
}

export default LocationName
