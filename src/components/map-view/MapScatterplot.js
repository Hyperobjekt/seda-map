import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { scatterOptions } from '../../constants/scatterOptions';
import { getPaddedMinMax } from '../../modules/metrics';
import Hint from '../base/Hint';
import { fade } from '@material-ui/core/styles/colorManipulator';
import * as _isEqual from 'lodash.isequal';
import { getStops } from '../../modules/metrics';
import ColorStops from './ColorStops';
import ConnectedScatterplot from '../scatterplot/ConnectedScatterplot';
import { onHoverFeature, onViewportChange, onCoordsChange } from '../../actions/mapActions';
import { loadLocation } from '../../actions/featuresActions';

export class MapScatterplot extends Component {
  static propTypes = {
    region: PropTypes.string,
    yVar: PropTypes.string,
    xVar: PropTypes.string,
    zVar: PropTypes.string,
    colors: PropTypes.array,
    metric: PropTypes.object,
    yRange: PropTypes.object,
    stops: PropTypes.array,
    onHoverFeature: PropTypes.func,
    updateMapViewport: PropTypes.func,
    addSelectedLocation: PropTypes.func,
    onCoordsChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      baseScatterplot: null,
      overlayScatterplot: null
    }
  }

  /**
   * Gets the visual map that is used to color the base dots
   * in the scatterplot
   */
  _getVisualMapOverrides() {
    const { colors, metric: {min, max} } = this.props;
    return [{
      type: 'continuous',
      min,
      max,
      inRange: {
        color: colors.map(c => fade(c, 0.9))
      }
    }]
  }

  /**
   * Gets the configuration overrides for the base scatterplot
   */
  _getOverrides() {
    const { yRange } = this.props;
    return {
      visualMap: this._getVisualMapOverrides(),
      xAxis: scatterOptions.xAxis,
      yAxis: { ...yRange, splitNumber: 7 },
    }
  }

  _onClick = (location) => {
    this.props.addSelectedLocation(location)
    this.props.updateMapViewport(location)
  }
  
  _onHover = (location) => {
    if (location && location.id) {
      const feature = {
        id: location.id,
        properties: location,
      }
      this.props.onHoverFeature(feature);
    } else {
      this.props.onHoverFeature(null);
    }

  }

 _onMouseMove = (e) => {
   this.props.onCoordsChange({
     x: e.event.event.clientX, y: e.event.event.clientY
   })
  }

  componentDidMount() {
    this.setState({
      baseScatterplot: this._getOverrides(),
    })
  }

  componentDidUpdate(prevProps) {
    // update scatterplot overrides when metric or range changes
    if (
      !_isEqual(prevProps.metric, this.props.metric) ||
      !_isEqual(prevProps.yRange, this.props.yRange)
    ) {
      this.setState({
        baseScatterplot: this._getOverrides()
      })
    }
  }

  render() {
    return (
      <div className='map-scatterplot'>
        <div className="map-scatterplot__header">
          <p>
            Displaying {' '}
            <Hint text={this.props.metric.help}>
              {this.props.metric.label.toLowerCase()}
            </Hint>
            {' '}for {' '}
            {this.props.region}
          </p>
        </div>
        <div className="map-scatterplot__container">
          { this.props.stops && 
            <ColorStops 
              stops={this.props.stops} 
              label={false} 
              vertical={true} 
            />
          }
          { 
            this.state.baseScatterplot && 
            <ConnectedScatterplot
              xVar={this.props.xVar}
              yVar={this.props.yVar}
              zVar={this.props.zVar}
              region={this.props.region}
              options={this.state.baseScatterplot}
              onHover={this._onHover}
              onClick={this._onClick}
              onMouseMove={this._onMouseMove}
            /> 
          }
        </div>
      </div>
    )
  }
}

/**
 * Pads both sides of the provided stops by the given amount
 * @param {*} stops 
 * @param {*} amount 
 */
const getPaddedStops = (stops, amount) => {
  const targetLength = (stops.length-1) + (amount*2)
  const newStops = [];
  for(var i = 0; i < targetLength; i++) {
    newStops[i] = (i >= (targetLength - stops.length + amount)) ?
      ((i <= stops.length - 1) ? stops[i] : stops[stops.length - 1])
      : stops[0]
  }
  return newStops
}

const mapStateToProps = (
  { metrics }, 
  { match: { params: { region, metric, demographic } } }
) => { 
  region = (region === 'schools' ? 'districts' : region);
  return ({
    region,
    yVar: demographic + '_' + metric,
    xVar: 'all_ses',
    zVar: 'sz',
    yRange: getPaddedMinMax(metrics, metric, 0),
    stops: getPaddedStops(getStops(metrics, metric), 0), 
    colors: metrics.colors,
    metric: metrics.items[metric],
  })
}

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature) =>
    dispatch(onHoverFeature(feature)),
  onCoordsChange: (coords) =>
    dispatch(onCoordsChange(coords)),
  addSelectedLocation: (location) => (
    dispatch(loadLocation(location))
  ),
  updateMapViewport: (locationData) =>
    dispatch(onViewportChange({ 
      latitude: locationData.lat, 
      longitude: locationData.lon,
      zoom: locationData.id.length+2
    }, true))
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapScatterplot)
