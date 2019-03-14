import Map from '../../components/map-view/Map';
import MapHeader from '../../components/map-view/MapHeader';
import MapLegend from '../../components/map-view/MapLegend';
import MapScatterplot from '../../components/map-view/MapScatterplot';
import MapSearch from '../../components/map-view/MapSearch';
import MapTooltip from '../../components/map-view/MapTooltip';
import MapSelectedLocations from '../../components/map-view/MapSelectedLocations';
import ReportCard from '../../components/report-card/ReportCard';
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
        <MapTooltip />
        <div className="map-view__header">
          <MapHeader />
          <MapSearch />
        </div>
        <div className="map-view__container">
          <div className="map-view__map">
            <Map />
            <MapLegend />
          </div>
          <div className="map-view__scatterplot-overlay">
            <MapScatterplot />
            <MapSelectedLocations />
          </div>
        </div>
        <div className={
          "map-view__report-card" +
          (reportCard ? " map-view__report-card--visible" : '')
        }>
          <ReportCard onClose={hideReportCard} />
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
