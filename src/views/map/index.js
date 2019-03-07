import Map from '../../components/map-view/Map';
import MapControls from '../../components/map-view/MapControls';
import MapLegend from '../../components/map-view/MapLegend';
import MapScatterplot from '../../components/map-view/MapScatterplot';
import MapSearch from '../../components/map-view/MapSearch';
import MapTooltip from '../../components/map-view/MapTooltip';
import MapSelectedLocations from '../../components/map-view/MapSelectedLocations';
import ReportCard from '../../components/map-view/ReportCard';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadRouteLocations } from '../../actions/featuresActions';
import { hideReportCard } from '../../actions/mapActions';


export class MapView extends Component {
  static propTypes = {
    loadRouteLocations: PropTypes.any,
    match: PropTypes.object,
    reportCard: PropTypes.bool,
    hideReportCard: PropTypes.func, 
    demographic: PropTypes.string, 
    onDemographicChange: PropTypes.func
  }

  componentDidMount() { 
    this.props.loadRouteLocations(
      this.props.match.params.locations
    );
  }

  render() {
    const { 
      reportCard, 
      hideReportCard,
    } = this.props;
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
          { 
            <div className={
              "map-view__report-card" +
              (reportCard ? " map-view__report-card--visible" : '')
            }>
              <ReportCard onClose={hideReportCard} />
            </div>
          }

        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ reportCard }) => ({
  reportCard: Boolean(reportCard)
})

const mapDispatchToProps = (dispatch) => ({
  loadRouteLocations: (locations) => 
    dispatch(loadRouteLocations(locations)),
  hideReportCard: () =>
    dispatch(hideReportCard()),
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapView)
