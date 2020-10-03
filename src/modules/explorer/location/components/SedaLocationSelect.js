import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import {
  Typography,
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
  Button
} from '@material-ui/core'
import { getRegions, getRegionLabel } from '../../app/selectors'
import { getLocationsByRegion } from '../../app/selectors/regions'
import { getLang } from '../../app/selectors/lang'
import { CloseIcon } from '../../../icons'
import { useRegion } from '../../app/hooks'
import useUiStore from '../../app/hooks/useUiStore'
import logger from '../../../logger'
import { SedaLocationName, useActiveLocation } from '..'
import useRemoveLocation from '../hooks/useRemoveLocation'
import useLocations from '../hooks/useLocations'
import { SedaSearch } from '../../search'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4
  },
  subheader: {
    textTransform: 'capitalize'
  }
}))

const LocationList = ({
  title,
  locations,
  active,
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
        locations.map((locationId, i) => {
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

const SedaLocationSelect = ({ onSelect }) => {
  const removeLocation = useRemoveLocation()
  const [activeRegion, setRegion] = useRegion()
  const [locations] = useLocations()
  const [, setActiveLocation] = useActiveLocation()
  const setHovered = useUiStore(state => state.setHovered)
  const locationsByRegion = getLocationsByRegion(locations)
  logger.debug(
    'selected locations by region:',
    locationsByRegion
  )
  const inactiveRegions = getRegions()
    .map(r => r.id)
    .filter(r => r !== activeRegion)

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

  const handleRegionChange = region => {
    setRegion(region)
  }

  const bind = {
    onLocationClick: handleLocationClick,
    onLocationHover: handleLocationHover,
    onLocationDismiss: handleLocationDismiss
  }

  return (
    <div style={{ padding: '4px 0', width: '100%' }}>
      <SedaSearch
        indices={['states', 'counties', 'districts', 'schools']}
        placeholder="Find a county, district, or school"
      />
      <LocationList
        title={getRegionLabel(activeRegion)}
        locations={locationsByRegion[activeRegion]}
        emptyMessage={getLang('LOCATIONS_ACTIVE_NONE', {
          region: activeRegion
        })}
        active
        {...bind}
      />
      {inactiveRegions.map(r => (
        <LocationList
          key={r}
          title={getRegionLabel(r)}
          locations={locationsByRegion[r]}
          emptyMessage={getLang('LOCATIONS_NONE', { region: r })}
          {...bind}>
          <ListItem style={{ paddingLeft: 44 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleRegionChange(r)}>
              Switch to {getRegionLabel(r)} view
            </Button>
          </ListItem>
        </LocationList>
      ))}
    </div>
  )
}

SedaLocationSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaLocationSelect
