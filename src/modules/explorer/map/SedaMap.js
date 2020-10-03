import React, { useMemo, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { getLayers, SEDA_SOURCES } from './selectors'
import MapBase, { useIdMap, useFlyToReset } from '../../map'
import {
  getSelectedColors,
  getFeatureProperty,
  getLocationIdsForRegion
} from '../app/selectors'
import { getLang } from '../app/selectors/lang'
import SedaMapLegend from './SedaMapLegend'
import {
  useActiveOptions,
  useHovered,
  useMarkersVisibility
} from '../app/hooks'
import { REGION_TO_ID_LENGTH } from '../app/constants/regions'
import { useFilters, useFilteredData } from '../filters'
import {
  useLocations,
  useAddLocation,
  useActiveLocationData
} from '../location'
import useFlyToLocation from './hooks/useFlyToLocation'

const selectedColors = getSelectedColors()

const useStyles = makeStyles(theme => ({
  legend: {
    position: 'absolute',
    bottom: 24,
    right: 16
  }
}))

/**
 * Displays the map with SEDA data layers
 */
const SedaMap = props => {
  /** current options for the map */
  const [metric, demographic, region] = useActiveOptions()
  // currently active data filters
  const filters = useFilters()
  const data = useFilteredData()
  /** currently selected location ids */
  const [locations] = useLocations()
  /** id of the currently hovered location */
  const [hoveredId, setHovered] = useHovered()
  /** id of the active location */
  const activeLocation = useActiveLocationData()
  /** boolean determining if the hovered location should show */
  const [showHovered] = useMarkersVisibility()
  /** function to add a location to the selected locations */
  const addLocation = useAddLocation()

  const [idMap, addToIdMap] = useIdMap()
  const flyToLocation = useFlyToLocation()
  const flyToReset = useFlyToReset()
  const isLoaded = useRef(false)
  /** memoized array of choropleth and dot layers */
  const layers = useMemo(() => {
    if (!metric || !demographic || !region) {
      return []
    }
    const ids = data.map(d => d.id)
    const context = { region, metric, demographic, filters, ids }
    return getLayers(context)
  }, [region, metric, demographic, filters, data])
  /** aria label for screen readers */
  const ariaLabel = getLang('UI_MAP_SR', {
    metric: getLang('LABEL_' + metric),
    region: getLang('LABEL_' + region),
    demographic: getLang('LABEL_STUDENTS_' + demographic)
  })
  /** object with class names for styling the component */
  const classes = useStyles()

  /** handler for map hover */
  const handleHover = (feature, coords) => {
    const id = getFeatureProperty(feature, 'id')
    if (id && id !== hoveredId) {
      // add schools to the ID map
      id.length === REGION_TO_ID_LENGTH['schools'] &&
        addToIdMap(feature.id, id)
    }
    setHovered(id, coords)
  }

  /** handler for map click */
  const handleClick = feature => {
    const id = getFeatureProperty(feature, 'id')
    addLocation(id)
  }

  /** handler for map load */
  const handleLoad = () => {
    // inform global listener that map has loaded
    window.SEDA.trigger('map')
    // zoom to US if needed once cover is shown
    // setTimeout(() => {
    //   flyToReset()
    // }, 1000)
    isLoaded.current = true
  }

  /** zoom to activated location */
  useEffect(() => {
    if (activeLocation && isLoaded.current) {
      flyToLocation(activeLocation)
    }
  }, [activeLocation, flyToLocation])

  const locationIds = getLocationIdsForRegion(region, locations)

  return (
    <MapBase
      selectedColors={selectedColors}
      sources={SEDA_SOURCES}
      layers={layers}
      idMap={idMap}
      selectedIds={locationIds}
      hoveredId={
        showHovered && hoveredId ? hoveredId : undefined
      }
      ariaLabel={ariaLabel}
      onHover={handleHover}
      onLoad={handleLoad}
      onClick={handleClick}>
      <SedaMapLegend className={classes.legend} />
    </MapBase>
  )
}

export default SedaMap