
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { onHoverFeature, onViewportChange, onSelectFeature, onCoordsChange } from '../../actions/mapActions';
import { updateViewportRoute } from '../../modules/router';

import Map from '../base/Map';
import { DEFAULT_VIEWPORT } from '../../constants/dataOptions';

/**
 * Gets the viewport to use for the map based on the viewport
 * state and route parameters.
 * @param {*} vp 
 * @param {*} routeParams 
 * @returns {object} valid viewport object
 */
const getMapViewport = (vp, routeParams) => {
  if (vp && vp.zoom && vp.latitude && vp.longitude) {
    // viewport is valid
    return vp;
  } else if (routeParams && routeParams.zoom && routeParams.lat && routeParams.lon) {
    // no valid viewport in store, use the one in the route
    return {
      latitude: parseFloat(routeParams.lat),
      longitude: parseFloat(routeParams.lon),
      zoom: parseFloat(routeParams.zoom),
      ...vp
    }
  }
  // no viewport in store or route, use default
  return {
    ...DEFAULT_VIEWPORT,
    ...vp
  }
}

const mapStateToProps = ({ 
  map: { viewport },
  sections: { map: { hovered } },
  selected
}, 
{
  match: { params: { metric, demographic, region, ...rest } }
}) => ({
  region,
  hovered,
  viewport: getMapViewport(viewport, rest),
  choroplethVar: demographic + '_' + metric,
  colors: selected.colors,
  selected: selected && selected[region] ? 
    selected[region] : []
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHover: (feature, coords) => (
    dispatch(onHoverFeature(feature, 'map')) &&
    dispatch(onCoordsChange(coords))
  ),
  onViewportChange: (vp) => {
    dispatch(onViewportChange(vp))
    updateViewportRoute(ownProps, vp);
  },
  onClick: (feature) => 
    dispatch(onSelectFeature(feature, ownProps.match.params.region)),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Map);
