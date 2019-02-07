import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defaultMapStyle, getChoroplethLayer } from '../../style/map-style';
import { onHoverFeature, onViewportChange, onSelectFeature } from '../../actions/mapActions';

class Map extends Component {

  state = {
    mapStyle: defaultMapStyle,
    tooltip: {
      x:0,
      y:0,
    }
  };

  getContainerSize() {
    if (!this.mapContainer) {
      return { width: 400, height: 400 }
    }
    return {
      width: this.mapContainer.clientWidth,
      height: this.mapContainer.clientHeight
    }
  }

  handleResize() {
    this.updateDimensions();
  }

  updateDimensions(dimensions = this.getContainerSize()) {
    this.props.onViewportChange(dimensions);
  }

  componentDidMount() {
    window.addEventListener(
      'resize', this.handleResize.bind(this)
    );
    this.updateDimensions();
    this._updateChoropleth(true);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.metric !== this.props.metric ||
      prevProps.region !== this.props.region ||
      prevProps.demographic !== this.props.demographic
    ) {
      this._updateChoropleth();
    }
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize', this.handleResize.bind(this)
    );
  }

  _updateChoropleth(init = false) {
    const region = this.props.region;
    const dataProp = this._getChoroplethProperty();
    const choroplethLayer = getChoroplethLayer(region, dataProp);
    const updatedLayers = defaultMapStyle
      .get('layers')
      .splice(2, (init ? 0 : 1), choroplethLayer)
    const mapStyle = defaultMapStyle
      .set('layers', updatedLayers);
    this.setState({ mapStyle });
  }

  _onClick = event => {
    const { features } = event;
    const selectedFeature = features && 
      features.find(f => f.layer.id === 'choropleth');
    return selectedFeature &&
      this.props.onSelectFeature(selectedFeature)
  }

  _onHover = event => {
    const { features, srcEvent: { offsetX, offsetY } } = event;
    const hoveredFeature = features && 
      features.find(f => f.layer.id === 'choropleth');
    this.props.onHoverFeature(hoveredFeature);
    this.setState({ 
      tooltip: { x: offsetX, y: offsetY }
    });
  };

  _getChoroplethProperty() {
    const { metric, demographic } = this.props;
    return demographic + '_' + metric;
  }

  _renderTooltip() {
    const { tooltip } = this.state;
    const { hoveredFeature } = this.props;

    return hoveredFeature && (
      <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
        <div>GEOID: {hoveredFeature.properties.GEOID}</div>
        <div>VALUE: {' '}
          {hoveredFeature.properties[ this._getChoroplethProperty() ]}
        </div>
      </div>
    );
  }

  render() {
    const { mapStyle } = this.state;
    const { viewport, onViewportChange } = this.props;
    return (
      <div 
        className="map"
        ref={ (el) => this.mapContainer = el }
      >
        <div 
          className="map__container"
        >
          <ReactMapGL
            { ...viewport }
            mapStyle={mapStyle}
            onViewportChange={ (vp) => onViewportChange(vp) }
            onHover={this._onHover}
            onClick={this._onClick}
          >
            {this._renderTooltip()}
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

const mapStateToProps = (state) => ({
  ...state.map
});

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature) => dispatch(onHoverFeature(feature)),
  onViewportChange: (vp) => dispatch(onViewportChange(vp)),
  onSelectFeature: (feature) => dispatch(onSelectFeature(feature)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
