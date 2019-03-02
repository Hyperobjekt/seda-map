import React, { Component } from 'react'
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defaultMapStyle, getChoroplethLayer, getChoroplethOutline, getDotLayer, getBackgroundChoroplethLayer } from '../../style/map-style';
import { onHoverFeature, onViewportChange, onSelectFeature, onCoordsChange } from '../../actions/mapActions';
import { getChoroplethProperty } from '../../modules/map';
import mapboxgl from 'mapbox-gl';
import { getStops } from '../../modules/metrics';
import { isPropEqual, getRegionFromId } from '../../utils';
import { updateViewportRoute, getViewportFromRoute } from '../../modules/router';
import * as _isEqual from 'lodash.isequal';

class Map extends Component {

  state = {
    mapStyle: defaultMapStyle
  };

  _getContainerSize() {
    if (!this.mapContainer) {
      return { width: 400, height: 400 }
    }
    return {
      width: this.mapContainer.clientWidth,
      height: this.mapContainer.clientHeight
    }
  }

  _handleResize() {
    this._updateViewport();
  }

  _updateViewport(vp = this._getContainerSize()) {
    this.props.onViewportChange(vp);
    updateViewportRoute(this.props, vp);
  }

  _setFeatureState(region, featureId, state) {
    this.map && this.map.setFeatureState({
      source: 'composite', 
      sourceLayer: region, 
      id: featureId
    }, state);
  }

  /**
   * Updates the selected color on the state of the map features.
   * Removes colors from oldSelected and assigns colors to selectedIds.
   * @param {Array<string>} oldSelected 
   * @param {Array<string>} selectedIds 
   */
  _updateOutlineSelected(oldSelected = [], selectedIds = []) {
    oldSelected.forEach(id => {
      const region = getRegionFromId(id);
      this._setFeatureState(
        region, id, { selected: false}
      );
    })
    selectedIds.forEach((id,i) => {
      const region = getRegionFromId(id);
      this._setFeatureState(
        region, id, { selected: this.props.colors[i] }
      );
    })
  }

  /**
   * Updates the outline of a feature on hover
   * @param {*} oldFeature feature to remove highlight from
   * @param {*} newFeature feature to add highlight to
   * @param {*} region source layer
   */
  _updateOutlineHighlight(oldFeature, newFeature, region) {
    const featureId = newFeature ? newFeature.id : null;
    if (oldFeature && oldFeature.id) {
      this._setFeatureState(
        region, oldFeature.id, { hover: false}
      );
    }
    if (featureId) {
      this._setFeatureState(
        region, featureId, { hover: true}
      );
    }
  }

  _updateChoropleth(init = false) {
    const { region, dataProp, stops } = this.props;
    let updatedLayers;
    if (region !== 'schools') {
      const choroplethLayer = 
        getChoroplethLayer(region, dataProp, stops);
      const choroplethOutline = 
        getChoroplethOutline(region);
      updatedLayers = 
        defaultMapStyle
          .get('layers')
          .splice(4, (init ? 0 : 1), choroplethLayer)
          .splice(59, (init ? 0 : 1), choroplethOutline)
    } else {
      const choroplethLayer = getBackgroundChoroplethLayer('districts', dataProp, stops);
      const dotLayer = getDotLayer(region, dataProp, stops);
      updatedLayers = defaultMapStyle
        .get('layers')
        .splice(4, (init ? 0 : 1), choroplethLayer)
        .splice(59, (init ? 0 : 1), dotLayer)
    }

    const mapStyle = defaultMapStyle
      .set('layers', updatedLayers);
    this.setState({ mapStyle });
  }

  _onLoad = event => {
    this.map = event.target;
    this.map.addControl(new mapboxgl.AttributionControl(), 'bottom-left');
    this._updateOutlineSelected([], this.props.selectedIds)
  }

  _getUniqueFeatures(array, comparatorProperty) {
    const existingFeatureKeys = {};
    return array.filter(function(el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    });
  }

  _onClick = event => {
    const { features } = event;
    const { region } = this.props;
    // find features for current region that wer clicked
    const selectedFeature = features && 
      features.find(f => (
        (region !== 'schools' && f.layer.id === 'choropleth') ||
        (region === 'schools' && f.layer.id === 'dots')
      ));
    // dispatch selected feature event if selected
    return selectedFeature &&
      this.props.onSelectFeature(selectedFeature, region)
  }

  _onHover = event => {
    const { features, srcEvent: { offsetX, offsetY } } = event;
    const { region } = this.props;
    // find features on the active region
    const hoveredFeature = features && 
      features.find(f => (
        (region !== 'schools' && f.layer.id === 'choropleth') ||
        (region === 'schools' && f.layer.id === 'dots')
      ));
    // set the mouse coords
    const coords = { x: offsetX, y: offsetY };
    // trigger hover feature actions, padding the featue and
    // mouse coordinates
    this.props.onHoverFeature(hoveredFeature, coords);
  };

  _onHoverOut = event => {
    this.props.onHoverFeature(undefined, null);
  }

  componentDidMount() {
    // set the viewport from the route on initial load
    const initialViewport = {
      ...this.props.viewport,
      ...getViewportFromRoute(this.props.match)
    }
    this.props.onViewportChange(initialViewport);
    // listen to window resize events to resize the map accordingly
    window.addEventListener(
      'resize', this._handleResize.bind(this)
    );
    // call update viewport to update the width / height to fill the container
    this._updateViewport();
    // initialize the choropleth layer
    this._updateChoropleth(true);

  }


  componentDidUpdate(prevProps) {
    const { metric, region, demographic, hoveredFeature, selectedIds } = this.props;
    const oldFeature = prevProps.hoveredFeature;
    // update the choropleth if any of the map data has changed
    if (
      prevProps.metric !== metric ||
      prevProps.region !== region ||
      prevProps.demographic !== demographic
    ) {
      this._updateChoropleth();
    }
    // update the highlight if the hovered feature has changed
    if (
      !isPropEqual(oldFeature, hoveredFeature, 'id')
    ) {
      this._updateOutlineHighlight(
        oldFeature, 
        hoveredFeature, 
        region
      )
    }
    // update selected outlines
    const oldSelected = prevProps.selectedIds;
    if (!_isEqual(oldSelected, selectedIds)) {
      this._updateOutlineSelected(
        oldSelected, 
        selectedIds
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize', this._handleResize.bind(this)
    );
  }

  render() {
    const { mapStyle } = this.state;
    const { viewport } = this.props;
    return (
      <div 
        className="map"
        ref={ (el) => this.mapContainer = el }
        onMouseLeave={this._onHoverOut}
      >
        <div className="map__container">
          <ReactMapGL
            { ...viewport }
            mapStyle={mapStyle}
            onViewportChange={ (vp) => this._updateViewport(vp) }
            onHover={this._onHover}
            onClick={this._onClick}
            onLoad={this._onLoad}
            attributionControl={false}
          >
            <div className="map__zoom">
              <NavigationControl onViewportChange={ (vp) => this._updateViewport(vp)} />
            </div>
          </ReactMapGL>
        </div>
      </div>
    );
  }
}

Map.propTypes = {
  metric: PropTypes.string,
  demographic: PropTypes.string,
  region: PropTypes.string,
  viewport: PropTypes.object,
  onViewportChange: PropTypes.func,
  onHoverFeature: PropTypes.func,
  onSelectFeature: PropTypes.func,
}

const mapStateToProps = ({ 
  map: { viewport },
  hovered: { feature },
  metrics,
  selected
}, 
{
  match: { params: { metric, demographic, region } }
}) => ({
  region,
  viewport,
  demographic,
  dataProp: getChoroplethProperty({metric, demographic}),
  stops: getStops(metrics, metric),
  hoveredFeature: feature,
  metricItem: metrics.items && metrics.items[metric] ?
    metrics.items[metric] : {},
  colors: selected.colors,
  selectedIds: selected[region]
});

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature, coords) => (
    dispatch(onHoverFeature(feature)) &&
    dispatch(onCoordsChange(coords))
  ),
  onViewportChange: (vp) => dispatch(onViewportChange(vp)),
  onSelectFeature: (feature, region) => dispatch(onSelectFeature(feature, region)),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Map);
