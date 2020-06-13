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
import {
  getRegions,
  getRegionLabel,
  getFeatureProperty
} from '../../selectors'
import { getLocationsByRegion } from '../../selectors/regions'
import { getLang } from '../../selectors/lang'
import { CloseIcon } from '../../../icons'
import {
  useActiveLocation,
  useRegion,
  useLocations,
  useRemoveLocation
} from '../../hooks'
import SedaSearch from '../SedaSearch'
import SedaLocationName from '../location/SedaLocationName'
import useUiStore from '../../hooks/useUiStore'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4
  },
  subheader: {
    textTransform: 'capitalize'
  },
  button: {
    textTransform: 'capitalize',
    borderRadius: theme.shape.borderRadius,
    '& .MuiListItemText-secondary': {
      fontSize: theme.typography.pxToRem(12)
    }
  },
  active: theme.mixins.activeListButton
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
        locations.map((l, i) => {
          return (
            <ListItem
              button
              key={l.id}
              onMouseEnter={e => onLocationHover(l, e)}
              onMouseLeave={e => onLocationHover(null, e)}
              onClick={e => onLocationClick(l, e)}
              {...ListItemProps}>
              <SedaLocationName
                locationId={getFeatureProperty(l, 'id')}
                markerPosition="left"
                small
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={e => onLocationDismiss(l, e)}>
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
  const inactiveRegions = getRegions()
    .map(r => r.id)
    .filter(r => r !== activeRegion)

  const handleLocationClick = location => {
    setActiveLocation(getFeatureProperty(location, 'id'))
  }

  const handleLocationHover = location => {
    setHovered(getFeatureProperty(location, 'id'), null, {
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
        indices={['counties', 'districts', 'schools']}
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
