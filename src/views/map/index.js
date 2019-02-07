import React from 'react'
import { connect } from 'react-redux'
import Map from '../../components/map-view/Map';
import MapControls from '../../components/map-view/MapControls';
import MapLegend from '../../components/map-view/MapLegend';
import MapScatterplot from '../../components/map-view/MapScatterplot';
import MapSearch from '../../components/map-view/MapSearch';

const MapView = props => (
  <div className="map-view">
    <div className="map-view__container">
      <Map />
      <div className="map-view__search-overlay">
        <MapSearch />
      </div>
      <div className="map-view__controls-overlay">
        <MapLegend />
        <MapControls />
      </div>
      <div className="map-view__scatterplot-overlay">
        <MapScatterplot />
      </div>
    </div>
  </div>
)

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView)
