import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import {
  Typography,
  ListSubheader,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'
import { CloseIcon } from '../../../icons'
import { useRegion } from '../../app/hooks'
import useUiStore from '../../app/hooks/useUiStore'
import { SedaLocationName, useActiveLocation } from '..'
import useRemoveLocation from '../hooks/useRemoveLocation'
import useLocations from '../hooks/useLocations'
import { SedaSearch } from '../../search'

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4
  }
}))

const LocationList = ({
  title,
  locations,
  emptyMessage,
  children,
  ListItemProps = {},
  onLocationHover = () => {},
  onLocationClick = () => {},
  onLocationDismiss = () => {},
  ...props
}) => {
  const classes = useStyles()
  return (
    <List
      classes={{ root: classes.root }}
      aria-label="selected locations"
      subheader={
        title && (
          <ListSubheader
            className={classes.subheader}
            disableSticky>
            {title}
          </ListSubheader>
        )
      }
      {...props}>
      {locations &&
        locations.map(locationId => {
          return (
            <ListItem
              button
              key={locationId}
              onMouseEnter={e => onLocationHover(locationId, e)}
              onMouseLeave={e => onLocationHover(null, e)}
              onClick={e => onLocationClick(locationId, e)}
              {...ListItemProps}>
              <SedaLocationName
                locationId={locationId}
                markerPosition="left"
                small
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={e =>
                    onLocationDismiss(locationId, e)
                  }>
                  <CloseIcon style={{ fontSize: 16 }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      {(!locations || locations.length === 0) && emptyMessage && (
        <ListItem style={{ paddingLeft: 44 }}>
          <Typography variant="caption">
            {emptyMessage}
          </Typography>
        </ListItem>
      )}
      {children}
    </List>
  )
}

const SedaLocationSelect = () => {
  const removeLocation = useRemoveLocation()
  const [activeRegion] = useRegion()
  const [locations] = useLocations()
  const [, setActiveLocation] = useActiveLocation()
  const setHovered = useUiStore(state => state.setHovered)

  const handleLocationClick = location => {
    setActiveLocation(location)
  }

  const handleLocationHover = location => {
    setHovered(location, null, {
      showTooltip: false,
      showMarkers: true
    })
  }

  const handleLocationDismiss = location => {
    removeLocation(location)
  }

  return (
    <div style={{ padding: '4px 0', width: '100%' }}>
      <SedaSearch
        indices={['states', 'counties', 'districts', 'schools']}
        placeholder={getLang('LOCATIONS_SEARCH')}
      />
      <LocationList
        title={getLang('LOCATIONS_SELECTED')}
        locations={locations}
        emptyMessage={getLang('LOCATIONS_ACTIVE_NONE', {
          region: activeRegion
        })}
        onLocationClick={handleLocationClick}
        onLocationHover={handleLocationHover}
        onLocationDismiss={handleLocationDismiss}
      />
    </div>
  )
}

SedaLocationSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaLocationSelect
