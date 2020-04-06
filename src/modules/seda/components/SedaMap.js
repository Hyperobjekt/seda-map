import React, { useMemo, useEffect } from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import { NavigationControl } from 'react-map-gl'

import { getLayers } from '../../map/selectors'
import MapBase from '../../map/components/MapBase'
import {
  getSelectedColors,
  getFeatureProperty,
  getLocationIdsForRegion,
  getFeatureFromArray
} from '../../../shared/selectors'
import { getLang } from '../../../shared/selectors/lang'
import { getStateViewportByFips } from '../../../shared/selectors/states'
import SedaMapLegend from './SedaMapLegend'
import { makeStyles } from '@material-ui/core'
import bbox from '@turf/bbox'
import { ZoomToControl } from '../../map'
import {
  useActiveOptionIds,
  useFilters,
  useActiveView,
  useLocations,
  useHovered,
  useMarkersVisibility,
  useMapViewport,
  useActiveLocation,
  useAddLocation
} from '../hooks'

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
  const [{ prefix, largest }] = useFilters()
  /** currently selected location ids */
  const [locations] = useLocations()
  /** current active view (map, chart, or split) */
  const [view] = useActiveView()
  /** id of the currently hovered location */
  const [hoveredId, setHovered] = useHovered()
  /** id of the active location */
  const [activeLocationId] = useActiveLocation()
  /** boolean determining if the hovered location should show */
  const [showHovered] = useMarkersVisibility()
  /** function to add a location to the selected locations */
  const addLocation = useAddLocation()
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
    setTimeout(() => {
      if (
        viewport.zoom === 3.5 &&
        viewport.latitude === 38 &&
        viewport.longitude === -97 &&
        view === 'map'
      ) {
        const newViewport = getStateViewportByFips(
          null,
          viewport
        )
        setViewport({
          ...newViewport,
          transitionDuration: 3000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: ease.easeCubic
        })
      }
    }, 1000)
  }

  /** handler for zoom to U.S. */
  const handleResetViewport = () => {}

  /** zoom to filtered location when filter is selected */
  useEffect(() => {
    if (!prefix) {
      return
    }
    const newViewport = getStateViewportByFips(prefix, viewport)
    if (newViewport) {
      setViewport({
        ...newViewport,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      })
    }
  }, [prefix])

  /** zoom to activated location */
  useEffect(() => {
    const data = getFeatureFromArray(locations, activeLocationId)
    if (!data || !data.geometry) return
    const { width, height } = viewport
    const vp = new WebMercatorViewport({ width, height })
    const featureBbox = bbox(data)
    const bounds = [
      [featureBbox[0], featureBbox[1]],
      [featureBbox[2], featureBbox[3]]
    ]
    const newViewport = vp.fitBounds(bounds, {
      padding: 20
    })
    setViewport({
      ...newViewport,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: ease.easeCubic
    })
  }, [activeLocationId, locations])

  const locationIds = getLocationIdsForRegion(region, locations)

  return (
    <MapBase
      selectedColors={selectedColors}
      layers={layers}
      viewport={viewport}
      idMap={{}}
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
