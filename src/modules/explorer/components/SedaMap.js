import React, { useMemo, useEffect, useRef } from 'react'
import { NavigationControl } from 'react-map-gl'
import { getLayers } from '../../map/selectors'
import MapBase from '../../map/components/MapBase'
import {
  getSelectedColors,
  getFeatureProperty,
  getLocationIdsForRegion
} from '../../../shared/selectors'
import { getLang } from '../../../shared/selectors/lang'
import SedaMapLegend from './SedaMapLegend'
import { makeStyles } from '@material-ui/core'
import { ZoomToControl } from '../../map'
import {
  useActiveOptionIds,
  useFilters,
  useLocations,
  useHovered,
  useMarkersVisibility,
  useMapViewport,
  useAddLocation,
  useFlyToState,
  useFlyToFeature,
  useFlyToReset,
  useActiveLocationFeature,
  useIdMap
} from '../hooks'
import useDataOptions from '../hooks/useDataOptions'
import { REGION_TO_ID_LENGTH } from '../../../shared/constants/regions'
import useMapStore from '../hooks/useMapStore'

const selectedColors = getSelectedColors()

const useStyles = makeStyles(theme => ({
  legend: {
    position: 'absolute',
    bottom: 24,
    right: 16
  }
}))

const SedaMap = props => {
  /** viewport with center lat / lng, zoom, width, height */
  const [viewport, setViewport] = useMapViewport()
  /** current options for the map */
  const [metric, demographic, region] = useActiveOptionIds()
  /** currently active data filters */
  const [{ prefix }] = useFilters()
  /** currently selected location ids */
  const [locations] = useLocations()
  /** id of the currently hovered location */
  const [hoveredId, setHovered] = useHovered()
  /** id of the active location */
  const activeFeature = useActiveLocationFeature()
  /** boolean determining if the hovered location should show */
  const [showHovered] = useMarkersVisibility()
  /** function to add a location to the selected locations */
  const addLocation = useAddLocation()
  const addFeatureData = useDataOptions(
    state => state.addFeatureData
  )
  const [idMap, addToIdMap] = useIdMap()
  const flyToState = useFlyToState()
  const flyToFeature = useFlyToFeature()
  const flyToReset = useFlyToReset()
  const isLoaded = useRef(false)
  /** memoized array of choropleth and dot layers */
  const layers = useMemo(() => {
    if (!metric || !demographic || !region) {
      return []
    }
    const context = { region, metric, demographic }
    return getLayers(context)
  }, [region, metric, demographic])
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
      addFeatureData(feature.properties)
      // add schools to the ID map
      id.length === REGION_TO_ID_LENGTH['schools'] &&
        addToIdMap(feature.id, id)
    }
    setHovered(id, coords)
  }

  /** handler for map click */
  const handleClick = feature => {
    addLocation(feature)
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

  /** handler for zoom to U.S. */
  const handleResetViewport = e => {
    e.preventDefault()
    flyToReset()
  }

  /** zoom to filtered location when filter is selected */
  useEffect(() => {
    if (!prefix || prefix.length !== 2 || !isLoaded.current)
      return
    flyToState(prefix)
  }, [prefix, flyToState])

  /** zoom to activated location */
  useEffect(() => {
    if (activeFeature && isLoaded.current) {
      flyToFeature(activeFeature)
    }
  }, [activeFeature, flyToFeature])

  const locationIds = getLocationIdsForRegion(region, locations)

  return (
    <MapBase
      selectedColors={selectedColors}
      layers={layers}
      viewport={viewport}
      idMap={idMap}
      selectedIds={locationIds}
      hoveredId={
        showHovered && hoveredId ? hoveredId : undefined
      }
      ariaLabel={ariaLabel}
      onHover={handleHover}
      onLoad={handleLoad}
      onViewportChange={setViewport}
      onClick={handleClick}>
      <div className="map__zoom">
        <NavigationControl
          showCompass={false}
          onViewportChange={setViewport}
        />
        <ZoomToControl
          title="Zoom to U.S."
          onClick={handleResetViewport}
        />
      </div>
      <SedaMapLegend className={classes.legend} />
    </MapBase>
  )
}

export default SedaMap
