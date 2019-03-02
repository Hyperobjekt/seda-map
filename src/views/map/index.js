import Map from '../../components/map-view/Map';
import MapControls from '../../components/map-view/MapControls';
import MapLegend from '../../components/map-view/MapLegend';
import MapScatterplot from '../../components/map-view/MapScatterplot';
import MapSearch from '../../components/map-view/MapSearch';
import MapTooltip from '../../components/map-view/MapTooltip';
import MapSelectedLocations from '../../components/map-view/MapSelectedLocations';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadRouteLocations } from '../../actions/featuresActions';

export class MapView extends Component {
  static propTypes = {
    loadRouteLocations: PropTypes.any,
    match: PropTypes.object
  }

  componentDidMount() { 
    this.props.loadRouteLocations(this.props.match.params.locations);
  }

  render() {
    return (
      <div className="map-view">
        <div className="map-view__container">
          
          <MapTooltip />
          <div className="map-view__map">
            <Map />
          </div>
          <div className="map-view__search-overlay">
            <MapSearch />
          </div>
          <div className="map-view__scatterplot-overlay">
            <MapLegend />
            <MapScatterplot />
            <MapSelectedLocations />
            <MapControls />
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadRouteLocations: (locations) => 
    dispatch(loadRouteLocations(locations))
})

export default compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(MapView)
