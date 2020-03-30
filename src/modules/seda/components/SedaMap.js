import React, { useMemo, useEffect } from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import PropTypes from 'prop-types'
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
import useMapStore from '../hooks/useMapStore'
import useDataOptions from '../hooks/useDataOptions'
import useUiStore from '../hooks/useUiStore'
import { getStateViewportByFips } from '../../../shared/selectors/states'
import SedaMapLegend from './SedaMapLegend'
import { makeStyles } from '@material-ui/core'
import bbox from '@turf/bbox'
import { ZoomToControl } from '../../map'

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
  const viewport = useMapStore(state => state.viewport)
  /** current region for the map */
  const region = useDataOptions(state => state.region)
  /** current metric for the map */
  const metric = useDataOptions(state => state.metric.id)
  /** current demographic for the map */
  const demographic = useDataOptions(
    state => state.demographic.id
  )
  /** currently active data filters */
  const { prefix, largest } = useDataOptions(
    state => state.filters
  )
  /** currently selected location ids */
  const locations = useDataOptions(state => state.locations)
  const locationIds = getLocationIdsForRegion(region, locations)
  /** current active view (map, chart, or split) */
  const view = useUiStore(state => state.view)
  /** id of the currently hovered location */
  const hoveredId = useUiStore(state => state.hovered)
  /** id of the active location */
  const activeLocationId = useDataOptions(
    state => state.activeLocation
  )
  /** function to get active location */
  const getActiveFeature = useDataOptions(
    state => state.getActiveFeature
  )
  /** boolean determining if the hovered location should show */
  const showHovered = useUiStore(state => state.showMarkers)
  /** function for setting the map viewport */
  const setViewport = useMapStore(state => state.setViewport)
  /** function for setting the hovered location */
  const setHovered = useUiStore(state => state.setHovered)
  /** function to add a location to the selected locations */
  const addLocationFromFeature = useDataOptions(
    state => state.addLocationFromFeature
  )
  /** memoized array of choropleth and dot layers */
  const layers = useMemo(() => {
    if (!metric || !demographic || !region.id) {
      return []
    }
    const context = { region: region.id, metric, demographic }
    return getLayers(context)
  }, [region, metric, demographic])
  /** aria label for screen readers */
  const ariaLabel = getLang('UI_MAP_SR', {
    metric: getLang('LABEL_' + metric),
    region: getLang('LABEL_' + region.id),
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
    addLocationFromFeature(feature)
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

  return (
    <MapBase
      selectedColors={selectedColors}
      layers={layers}
      viewport={viewport}
      idMap={{}}
      selectedIds={locationIds}
      hoveredId={showHovered && hoveredId}
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

SedaMap.propTypes = {}

export default SedaMap
