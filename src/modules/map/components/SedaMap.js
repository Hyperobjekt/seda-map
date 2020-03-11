import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  onHoverFeature,
  onViewportChange,
  handleLocationActivation,
  onHighlightedStateChange
} from '../actions'
import { getMapViewport, getLayers, defaultMapStyle } from '../selectors'
import MapBase from './MapBase'

import { updateViewportRoute } from '../../router'
import {
  getHoveredId,
  getSelectedColors,
  getScatterplotVars,
  isVersusFromVarNames
} from '../../../shared/selectors'
import { getLang } from '../../../shared/selectors/lang'

const selectedColors = getSelectedColors()

const SedaExplorerMap = ({
  view,
  region,
  viewport,
  metric,
  demographic,
  highlightedState,
  idMap,
  selectedIds,
  hoveredId,
  resetHighlightedState,
  onViewportChange,
  onHover,
  onClick
}) => {
  const zoomLevel =
    viewport.zoom > 11 ? 'school' : viewport.zoom > 8 ? 'district' : 'county'

  const vars = getScatterplotVars(region, metric, demographic)

  const showLegend =
    view === 'map' || isVersusFromVarNames(vars.xVar, vars.yVar)

  // reset highlighted state on zoom out
  useEffect(() => {
    if (
      viewport.zoom < 4.5 &&
      highlightedState !== 'us' &&
      viewport.transitionDuration === 0
    ) {
      resetHighlightedState && resetHighlightedState()
    }
    // eslint-disable-next-line
  }, [viewport.zoom]) // only execute when viewport zoom changes

  // map layers for choropleths / dots
  const layers = useMemo(() => {
    if (!metric || !demographic || !region) {
      return []
    }
    return getLayers({
      region,
      metric,
      demographic,
      highlightedState,
      zoomLevel
    })
  }, [region, metric, demographic, highlightedState, zoomLevel])

  // handle hover
  const handleHover = (feature, coords) => onHover(feature, vars, coords)

  const ariaLabel = getLang('UI_MAP_SR', {
    metric: getLang('LABEL_' + metric),
    region: getLang('LABEL_' + region),
    demographic: getLang('LABEL_STUDENTS_' + demographic)
  })

  const handleLoad = () => {
    window.SEDA.trigger('map')
    setTimeout(() => {
      if (
        viewport.zoom === 3.5 &&
        viewport.latitude === 38 &&
        viewport.longitude === -97 &&
        view === 'map'
      ) {
        // if default viewport, zoom to US
        resetHighlightedState()
      }
    }, 1000)
  }

  return (
    <div className="seda-map">
      <MapBase
        style={defaultMapStyle}
        selectedColors={selectedColors}
        attributionControl={true}
        layers={layers}
        viewport={viewport}
        idMap={idMap}
        selectedIds={selectedIds}
        hoveredId={hoveredId}
        ariaLabel={ariaLabel}
        onHover={handleHover}
        onLoad={handleLoad}
        {...{ onViewportChange, onClick }}
      />
    </div>
  )
}

SedaExplorerMap.propTypes = {
  active: PropTypes.bool,
  showLegend: PropTypes.bool,
  region: PropTypes.string,
  viewport: PropTypes.object,
  metric: PropTypes.string,
  demographic: PropTypes.string,
  highlightedState: PropTypes.string,
  idMap: PropTypes.object,
  selectedIds: PropTypes.array,
  hoveredId: PropTypes.string,
  resetHighlightedState: PropTypes.func,
  onViewportChange: PropTypes.func,
  onHover: PropTypes.func,
  onClick: PropTypes.func
}

const mapStateToProps = (
  {
    selected,
    ui: { legendType },
    map: { idMap, viewport },
    sections: { hovered }
  },
  {
    match: {
      params: {
        view,
        region,
        metric,
        demographic,
        highlightedState = 'us',
        ...params
      }
    }
  }
) => {
  return {
    view,
    idMap,
    region,
    metric,
    demographic,
    highlightedState,
    selected,
    hovered,
    legendType,
    hoveredId: getHoveredId(hovered),
    selectedIds: selected[region],
    viewport: getMapViewport(viewport, params)
  }
}

const mapDispatchToProps = dispatch => ({
  onHover: (feature, vars, coords) => {
    dispatch(onHoverFeature(feature, coords, vars))
    // dispatch(setTooltipVars(vars))
    // dispatch(onCoordsChange(coords))
    // dispatch(addToFeatureIdMap([ feature ]))
  },
  onViewportChange: (vp, updateRoute = true) => {
    dispatch(onViewportChange(vp))
    updateRoute && updateViewportRoute(vp)
  },
  resetHighlightedState: () => {
    dispatch(onHighlightedStateChange('us'))
  },
  onClick: feature => dispatch(handleLocationActivation(feature, 'map'))
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SedaExplorerMap)
