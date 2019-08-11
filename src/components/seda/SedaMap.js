import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { onHoverFeature, onViewportChange, onCoordsChange, addToFeatureIdMap, handleLocationActivation, setTooltipVars, onHighlightedStateChange } from '../../actions';
import { updateViewportRoute } from '../../modules/router';
import { getMapViewport, getLayers, defaultMapStyle } from '../organisms/Map/selectors';
import { getHoveredId } from '../../modules/sections';
import { getSelectedColors, getScatterplotVars, isVersusFromVarNames } from '../../modules/config';
import MapBase from '../organisms/Map';
import SedaMapLegend from './SedaMapLegend';

const selectedColors = getSelectedColors();

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
  onClick,
}) => {
  const zoomLevel = viewport.zoom > 11 ? 'school' :
    viewport.zoom > 8 ? 'district' : 'county'

  const vars = getScatterplotVars(region, metric, demographic);

  const showLegend = (
    view === 'map' || 
    isVersusFromVarNames(vars.xVar, vars.yVar)
  )
  
  // reset highlighted state on zoom out
  useEffect(() => {
    if (viewport.zoom < 4.5 && 
      highlightedState !== 'us' && 
      viewport.transitionDuration === 0
    ) {
      resetHighlightedState && resetHighlightedState()
    }
  }, [viewport.zoom])

  // map layers for choropleths / dots
  const layers = useMemo(() => {
    return getLayers({
      region, metric, demographic, highlightedState, zoomLevel
    })
  }, [ region, metric, demographic, highlightedState, zoomLevel ])
  
  // handle hover
  const handleHover = (feature, coords) =>
    onHover(feature, vars, coords)

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
        onHover={handleHover}
        {...{onViewportChange, onClick}}
      ></MapBase>
      { showLegend && <SedaMapLegend /> }
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
  onClick: PropTypes.func,
}

const mapStateToProps = ({ 
  selected,
  ui: { legendType },
  map: { idMap, viewport },
  sections: { hovered },
},
{ match: { params: { view, secondary, region, metric, demographic, highlightedState, ...params } } }
) => {
  return ({
    view,
    idMap,
    region,
    metric,
    demographic,
    secondary,
    highlightedState,
    selected,
    hovered,
    legendType,
    hoveredId: getHoveredId(hovered),
    selectedIds: selected[region],
    viewport: getMapViewport(viewport, params),
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHover: (feature, vars, coords) => {
    dispatch(onHoverFeature(feature))
    dispatch(setTooltipVars(vars))
    dispatch(onCoordsChange(coords))
    dispatch(addToFeatureIdMap([ feature ]))
  },
  onViewportChange: (vp, updateRoute = true) => {
    dispatch(onViewportChange(vp))
    updateRoute && updateViewportRoute(ownProps, vp);
  },
  resetHighlightedState: () => {
    dispatch(onHighlightedStateChange('us', ownProps))
  },
  onClick: (feature) => dispatch(
    handleLocationActivation(feature)
  )
})


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SedaExplorerMap)