import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { scatterOptions } from '../../constants/scatterOptions';
import { getPaddedMinMax } from '../../modules/metrics';
import { loadVarsForRegion } from '../../actions/scatterplotActions';
import { onHoverFeature, onCoordsChange, onViewportChange } from '../../actions/mapActions';
import { getRegionData } from '../../modules/scatterplot';
import { getDataScale } from '../../utils';
import { fetchResults } from '../../actions/searchActions';
import * as _isEmpty from 'lodash.isempty';
import Hint from '../base/Hint';
import { loadLocation } from '../../actions/featuresActions';
import { fade } from '@material-ui/core/styles/colorManipulator';
import * as _isEqual from 'lodash.isequal';
import { getStops } from '../../modules/metrics';
import ColorStops from './ColorStops';
import { getScatterplotConfig } from '../../utils/scatterplot';
import Scatterplot from '../scatterplot/Scatterplot';
import ConnectedScatterplot from './ConnectedScatterplot';


// TODO: refactoring, this component is too big.
//   Should split into presentational scatterplot component
//   and pass data to abstact data loading
export class MapScatterplot extends Component {
  static propTypes = {
    region: PropTypes.string,
    yVar: PropTypes.string,
    xVar: PropTypes.string,
    zVar: PropTypes.string,
    xData: PropTypes.object,
    yData: PropTypes.object,
    zData: PropTypes.object,
    loadVarsForRegion: PropTypes.func,
    colors: PropTypes.array,
    metric: PropTypes.object,
    yRange: PropTypes.object,
    hoveredFeature: PropTypes.object,
    onHoverFeature: PropTypes.func,
    loadMetadataForPlace: PropTypes.func,
    hoveredMetaData: PropTypes.object,
    updateMapViewport: PropTypes.func,
    addSelectedLocation: PropTypes.func,
    selectedIds: PropTypes.array,
    selectedColors: PropTypes.array,
    stops: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.state = {
      baseScatterplot: null,
      overlayScatterplot: null
    }
  }

  _loadScatterplotData() {
    const { 
      xVar, 
      yVar, 
      zVar, 
      xData, 
      yData, 
      zData, 
      region, 
      loadVarsForRegion 
    } = this.props;
    const vars = [];
    zVar && !zData && vars.push(zVar);
    xVar && !xData && vars.push(xVar);
    yVar && !yData && vars.push(yVar);
    loadVarsForRegion(vars, region);
  }

  /**
   * Gets the visual map that is used to color the base dots
   * in the scatterplot
   */
  _getBaseVisualMapOverrides() {
    const { colors, metric: {min, max} } = this.props;
    return {
      min,
      max,
      inRange: {
        color: colors.map(c => fade(c, 0.9))
      }
    }
  }

  /**
   * Gets the visual map that is used to color the hover
   * dot and any selected locations.
   */
  _getOverlayVisualMapOverrides() {
    const { selectedColors, selectedIds } = this.props;
    return {
      show: false,
      type: 'piecewise',
      dimension: 4,
      pieces: [
        { value: -1, color: '#f00' }, // hovered style
        ...selectedIds.map((id, i) => {
          return {
            value: i,
            color: selectedColors[i]
          }
        })
      ]
    }
  }

  /**
   * Gets the scatterplot data for a given ID
   * @param {string} id 
   * @param {number} i optional index to add to the data
   */
  _getDataForFeatureId(id, i = -1) {
    const { xData, yData, zData } = this.props;
    return xData[id] && yData[id] && zData[id] ?
      [ xData[id], yData[id], zData[id], id, i ] :
      [ ]
  }

  /**
   * Gets scatterplot data for an list of IDs
   * @param {Array<string>} ids
   */
  _getDataForFeatureIds(ids) {
    const { xData, yData, zData } = this.props;
    return xData && yData && zData ?
      ids.map((id,i) => this._getDataForFeatureId(id, i)) :
      [ ]
  }

  /**
   * Gets the configuration overrides for the overlay scatterplot
   */
  _getOverlayOverrides() {
    const { hoveredFeature, yRange, selectedIds, zData } = this.props;
    const sizeScale = getDataScale(zData, { range: [5, 40] });
    return {
      xAxis: { ...scatterOptions.xAxis, show: false },
      yAxis: { ...yRange, show: false },
      visualMap: this._getOverlayVisualMapOverrides(),
      series: [
        {
          type: 'effectScatter',
          symbolSize: 10,
          data: hoveredFeature && 
            hoveredFeature.properties.id ? 
              [this._getDataForFeatureId(hoveredFeature.properties.id, -1)] : 
              []
          ,
          z: 3
        },
        {
          data: this._getDataForFeatureIds(selectedIds), 
          symbolSize: (value) => sizeScale(value[2]),
          itemStyle: {
            borderWidth: 1.5,
            borderColor: '#fff',
            shadowColor: 'rgba(0,0,0,1)',
            shadowBlur: 2
          },
        }
      ]
    }
  }

  /**
   * Gets the configuration overrides for the base scatterplot
   */
  _getOverrides() {
    const { yRange } = this.props;
    return {
      visualMap: this._getBaseVisualMapOverrides(),
      xAxis: scatterOptions.xAxis,
      yAxis: { ...yRange, splitNumber: 7 },
    }
  }

  _handleHover = (data, e) => {
    if (!data) {
      return this.props.onHoverFeature(null, {x:0,y:0});
    }
    const feature = {
      id: data[3],
      properties: {
        id: data[3],
        [this.props.xVar]: data[0],
        [this.props.yVar]: data[1],
        ...this.props.hoveredMetaData
      },
    }
    // TODO: offsetting y value here to account for the header
    //    should either set position fixed on tooltip, or account
    //    for offset of parent container to avoid a hard coded value
    const coords = {
      x: e.event.clientX,
      y: e.event.clientY - 64
    }
    this.props.onHoverFeature(feature, coords);
    if (_isEmpty(this.props.hoveredMetaData)) {
      this.props.loadMetadataForPlace(feature.id)
    }
  }

  _handleClick = () => {
    const { updateMapViewport, hoveredFeature, hoveredMetaData } = this.props;
    this.props.addSelectedLocation({
      id: hoveredMetaData.id,
      latitude: hoveredMetaData.lat,
      longitude: hoveredMetaData.lon
    })
    updateMapViewport(hoveredFeature, hoveredMetaData)
  }

  componentDidMount() {
    this._loadScatterplotData();
    this.setState({
      baseScatterplot: this._getOverrides(),
      overlayScatterplot: this._getOverlayOverrides()
    })
  }

  componentDidUpdate(prevProps) {
    const { region, xVar, yVar, zVar, selectedIds, hoveredFeature } = this.props;
    if (
      prevProps.region !== region ||
      prevProps.xVar !== xVar ||
      prevProps.zVar !== zVar ||
      prevProps.yVar !== yVar
    ) {
      this._loadScatterplotData();
    }
    // update scatterplot overrides when metric or range changes
    if (
      !_isEqual(prevProps.metric, this.props.metric) ||
      !_isEqual(prevProps.yRange, this.props.yRange)
    ) {
      this.setState({
        baseScatterplot: this._getOverrides(),
        overlayScatterplot: this._getOverlayOverrides()
      })
    } else if (
      !_isEqual(prevProps.hoveredFeature, hoveredFeature) ||
      !_isEqual(prevProps.selectedIds, selectedIds)
    ) {
      this.setState({
        overlayScatterplot: this._getOverlayOverrides()
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
              onHover={this._handleHover.bind(this)}
              onClick={this._handleClick.bind(this)}
            /> 
          }
          { 
            this.state.overlayScatterplot && 
            <Scatterplot
              style={{ pointerEvents: 'none', position: 'absolute', width: '100%', height: '100%' }}
              options={this.state.overlayScatterplot}
            />
          }
        </div>
      </div>
    )
  }
}

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

const mapStateToProps = ({
  hovered: { feature },
  scatterplot, 
  metrics,
  search: { results },
  selected
}, {
  match: { params: { region, metric, demographic } }
}) => { 
  region = (region === 'schools' ? 'districts' : region);
  return ({
    region,
    demographic,
    selectedIds: selected[region],
    yVar: demographic + '_' + metric,
    xData: getRegionData(scatterplot, region, 'all_ses'),
    yData: getRegionData(scatterplot, region, demographic + '_' + metric),
    zData: getRegionData(scatterplot, region, 'sz'),
    yRange: getPaddedMinMax(metrics, metric, 1),
    xVar: 'all_ses',
    zVar: 'sz',
    stops: getPaddedStops(getStops(metrics, metric), 1), 
    loadedVars: scatterplot.data[region] ?
      Object.keys(scatterplot.data[region]) : [],
    colors: metrics.colors,
    metric: metrics.items[metric],
    selectedColors: selected.colors,
    hoveredFeature: feature ? feature : null,
    hoveredMetaData: feature && results[feature.properties.id] ? 
       results[feature.properties.id] : {}
  })
}

const mapDispatchToProps = (dispatch) => ({
  addSelectedLocation: (location) => (
    dispatch(loadLocation(location))
  ),
  onHoverFeature: (feature, coords) => (
    dispatch(onHoverFeature(feature)) &&
    dispatch(onCoordsChange(coords))
  ),
  loadMetadataForPlace: (id) =>
    dispatch(fetchResults(id)),
  loadVarsForRegion: (vars, region) => 
    dispatch(loadVarsForRegion(vars, region)),
  updateMapViewport: (feature, meta) =>
    meta ?
      dispatch(onViewportChange({ 
        latitude: parseFloat(meta.lat), 
        longitude: parseFloat(meta.lon),
        zoom: feature.id.length+2
      }, true)) : null
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapScatterplot)
