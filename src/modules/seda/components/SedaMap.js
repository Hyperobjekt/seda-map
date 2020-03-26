import React, { useMemo, useEffect } from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import * as ease from 'd3-ease'
import PropTypes from 'prop-types'
import {
  getMapViewport,
  getLayers,
  defaultMapStyle
} from '../../map/selectors'
import MapBase from '../../map/components/MapBase'
import {
  getHoveredId,
  getSelectedColors,
  getScatterplotVars,
  isVersusFromVarNames,
  getFeatureProperty
} from '../../../shared/selectors'
import { getLang } from '../../../shared/selectors/lang'
import useMapStore from '../hooks/useMapStore'
import useDataOptions from '../hooks/useDataOptions'
import useUiStore from '../hooks/useUiStore'
import { getStateViewportByFips } from '../../../shared/selectors/states'
import SedaMapLegend from './SedaMapLegend'
import { makeStyles } from '@material-ui/core'

const selectedColors = getSelectedColors()

const useStyles = makeStyles(theme => ({
  legend: {
    position: 'absolute',
    bottom: 24,
    right: 16
  }
}))

const SedaMap = props => {
  // pull required data from store
  const viewport = useMapStore(state => state.viewport)
  const region = useDataOptions(state => state.region)
  const metric = useDataOptions(state => state.metric)
  const demographic = useDataOptions(state => state.demographic)
  const { prefix } = useDataOptions(state => state.filters)
  const locationIds = useDataOptions(state =>
    state.getLocationIdsForRegion()
  )
  const view = useUiStore(state => state.view)
  const hoveredId = useUiStore(state => state.hovered)
  const showHovered = useUiStore(state => state.showTooltip)

  // pull required setters from store
  const setViewport = useMapStore(state => state.setViewport)
  const setHovered = useUiStore(state => state.setHovered)
  const addLocationFromFeature = useDataOptions(
    state => state.addLocationFromFeature
  )

  // geography region based on map zoom level
  const zoomLevel =
    viewport.zoom > 11
      ? 'school'
      : viewport.zoom > 8
      ? 'district'
      : 'county'

  // vars shown on the scatterplot for current selections
  const vars = getScatterplotVars(
    region.id,
    metric.id,
    demographic.id
  )

  // boolean determining is legend is visible
  const showLegend =
    view === 'map' || isVersusFromVarNames(vars.xVar, vars.yVar)

  // state highlighted from filters
  const highlightedState = null

  // map layers for choropleths / dots
  const layers = useMemo(() => {
    if (!metric || !demographic || !region) {
      return []
    }
    return getLayers({
      region: region.id,
      metric: metric.id,
      demographic: demographic.id,
      highlightedState,
      zoomLevel
    })
  }, [
    region.id,
    metric.id,
    demographic.id,
    highlightedState,
    zoomLevel
  ])

  // handle hover
  const handleHover = (feature, coords) => {
    const id = getFeatureProperty(feature, 'id')
    setHovered(id, coords)
  }

  const handleClick = feature => {
    addLocationFromFeature(feature)
  }

  const ariaLabel = getLang('UI_MAP_SR', {
    metric: getLang('LABEL_' + metric.id),
    region: getLang('LABEL_' + region.id),
    demographic: getLang('LABEL_STUDENTS_' + demographic.id)
  })

  const handleLoad = () => {
    window.SEDA.trigger('map')
    // zoom to US if needed
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

  const classes = useStyles()

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
      {props.children}
      <SedaMapLegend className={classes.legend} />
    </MapBase>
  )
}

SedaMap.propTypes = {}

export default SedaMap
