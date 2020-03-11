import React, { useMemo, useEffect } from 'react'
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
  isVersusFromVarNames
} from '../../../shared/selectors'
import { getLang } from '../../../shared/selectors/lang'
import useMapStore from '../hooks/useMapStore'
import useDataOptions from '../hooks/useDataOptions'
import useUiStore from '../hooks/useUiStore'

const selectedColors = getSelectedColors()

const getIdsForRegion = (regionId, locationIds) => {
  return []
}

const SedaMap = props => {
  // pull required data from store
  const viewport = useMapStore(state => state.viewport)
  const region = useDataOptions(state => state.region)
  const metric = useDataOptions(state => state.metric)
  const demographic = useDataOptions(state => state.demographic)
  const locations = useDataOptions(state => state.locations)
  const filters = useDataOptions(state => state.filters)
  const view = useUiStore(state => state.view)
  const hovered = useUiStore(state => state.hovered)
  const selectedIds = getIdsForRegion(region.id, locations)

  // pull required setters from store
  const setViewport = useMapStore(state => state.setViewport)
  const setHovered = useUiStore(state => state.setHovered)
  const setLocations = useDataOptions(
    state => state.setLocations
  )
  const setCoords = useUiStore(state => state.setCoords)

  // id for the hovered feature
  const hoveredId = getHoveredId(hovered)

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
    setHovered(feature)
    setCoords(coords)
  }

  const ariaLabel = getLang('UI_MAP_SR', {
    metric: getLang('LABEL_' + metric.id),
    region: getLang('LABEL_' + region.id),
    demographic: getLang('LABEL_STUDENTS_' + demographic.id)
  })

  const handleLoad = () => {
    window.SEDA.trigger('map')
    // zoom to US if needed
    // setTimeout(() => {
    //   if (
    //     viewport.zoom === 3.5 &&
    //     viewport.latitude === 38 &&
    //     viewport.longitude === -97 &&
    //     view === 'map'
    //   ) {
    //     // if default viewport, zoom to US
    //     resetHighlightedState()
    //   }
    // }, 1000)
  }

  return (
    <MapBase
      selectedColors={selectedColors}
      layers={layers}
      viewport={viewport}
      idMap={{}}
      selectedIds={[]}
      hoveredId={hoveredId}
      ariaLabel={ariaLabel}
      onHover={handleHover}
      onLoad={handleLoad}
      onViewportChange={setViewport}
      onClick={e => console.log(e)}
    />
  )
}

SedaMap.propTypes = {}

export default SedaMap
