import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { loadLocation } from '../../actions/featuresActions';
import { getChoroplethColors, getValuePositionForMetric, getSelectedColors, isGapDemographic } from '../../modules/config';
import { getRegionControl, getMetricControl, getDemographicGapControl, getHighlightControl } from '../../modules/controls';
import { onScatterplotData, onScatterplotLoaded } from '../../actions/scatterplotActions';
import { onHoverFeature, onViewportChange, onSelectFeature, onCoordsChange, updateCurrentState } from '../../actions/mapActions';
import { updateRoute } from '../../modules/router';
import { getStateProp } from '../../constants/statesFips';
import { getFeatureProperty } from '../../modules/features';
import SplitSection from '../base/SplitSection';
import { getMapViewport } from '../../modules/map';
import { updateViewportRoute } from '../../modules/router';
import { getLang } from '../../constants/lang';

const mapStateToProps = ({ 
  scatterplot: { data },
  selected,
  sections: { map: { hovered } },
  map: { usState, viewport },
},
{ match: { params: { region, metric, demographic, ...params } } }
) => {
  const vars = {
    yVar: demographic + '_' + metric,
    xVar: demographic + '_ses',
    zVar: 'sz'
  };
  const hoveredId = hovered && 
    hovered.properties && 
    hovered.properties.id ?
      hovered.properties.id : ''
  const controls = [
    getMetricControl(metric),
    getDemographicGapControl(demographic),
    getRegionControl(region),
    getHighlightControl(usState)
  ];
  const selectedArray = selected && selected[region] ? 
    selected[region] : []
  return ({
    section: {
      id: 'map',
      title: {
        text: getLang('MAP_TITLE'),
        controls
      },
      description: 
        getLang('MAP_DESCRIPTION_' + metric + (isGapDemographic(demographic) ? '_GAP': '')) + ' ' +
        getLang('MAP_DESCRIPTION_SES' + (isGapDemographic(demographic) ? '_GAP': '')) + ' ' +
        getLang('MAP_DESCRIPTION'),
      selected: selected && selected[region],
      cardMetrics: [ vars.xVar, vars.yVar ],
      headerMenu: {
        text: getLang('MAP_CONTROL_TEXT'),
        controls,
      }
    },
    scatterplot: {
      ...vars,
      region,
      data,
      variant: 'map',
      colors: getChoroplethColors(),
      selected: selectedArray,
      highlightedState: usState,
      hovered: hoveredId
    },
    map: {
      region,
      choroplethVar: vars.yVar,
      hovered: hoveredId,
      selected: selectedArray,
      colors: getSelectedColors(),
      viewport: getMapViewport(viewport, params)
    },
    legend: {
      colors: getChoroplethColors(),
      markerPosition: hovered && hovered.properties ?
        getValuePositionForMetric(
          getFeatureProperty(hovered, demographic + '_' + metric),
          demographic + '_' + metric
        ) : null,
      vertical: true
    }
  })
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onScatterplotClick: (location) => {
    dispatch(loadLocation(location))
    dispatch(onViewportChange({ 
      latitude: location.lat, 
      longitude: location.lon,
      zoom: location.id.length+2
    }, true))
  },
  onScatterplotData: (data, region) => 
    dispatch(onScatterplotData(data, region)),
  onScatterplotHover: (feature) =>
    dispatch(onHoverFeature(feature, 'map')),
  onScatterplotReady: () => 
    dispatch(onScatterplotLoaded('map')),
  onMapHover: (feature, coords) => (
    dispatch(onHoverFeature(feature, 'map')) &&
    dispatch(onCoordsChange(coords))
  ),
  onMapViewportChange: (vp) => {
    dispatch(onViewportChange(vp))
    updateViewportRoute(ownProps, vp);
  },
  onMapClick: (feature) => 
    dispatch(onSelectFeature(feature, ownProps.match.params.region)),
  onOptionChange: (id, option) => {
    switch(id) {
      case 'metric':
        return updateRoute(ownProps, { metric: option.id })
      case 'demographic':
        return updateRoute(ownProps, { demographic: option.id })
      case 'region':
        return updateRoute(ownProps, { region: option.id })
      case 'highlight':
        if (option.value === 'us') {
          dispatch(updateCurrentState(null))
        } else {
          const vp = {
            latitude: getStateProp(option.id, 'lat'),
            longitude: getStateProp(option.id, 'lon'),
            zoom: 5
          }
          dispatch(updateCurrentState(option.id))
          dispatch(onViewportChange(vp, true))
        }
        return;
      default:
        return;
    }
  },
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SplitSection)
