import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';
import { scatterOptions, hoverOptions } from '../../constants/scatterOptions';
import { getPaddedMinMax } from '../../modules/metrics';
import { loadVarsForRegion } from '../../actions/scatterplotActions';
import { onHoverFeature, onCoordsChange, onViewportChange } from '../../actions/mapActions';
import { getRegionData } from '../../modules/scatterplot';
import { mergeDatasets } from '../../utils';
import { fetchResults } from '../../actions/searchActions';
import * as _isEmpty from 'lodash.isempty';
import Hint from '../base/Hint';
import { loadLocation } from '../../actions/featuresActions';
import { fade } from '@material-ui/core/styles/colorManipulator';
import * as _isEqual from 'lodash.isequal';
import * as scale from 'd3-scale';
import * as d3array from 'd3-array';
import { getStops } from '../../modules/metrics';
import ColorStops from './ColorStops';


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
      overlayScatterplot: null,
      scatterplotData: null,
      dataRanges: {}
    }
  }

  _isVarLoaded(varName) {
    const { loadedVars } = this.props;
    return loadedVars.indexOf(varName) > -1
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

  _getVisualMap() {
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
   * Returns a scale function that can be used to map data values
   * to dot sizes
   */
  _getAxisScale(axis = 'z', targetRange = [5, 40]) {
    if (!this.state.dataRanges[axis]) { return () => 0 }
    return scale.scalePow()
      .exponent(1)
      .domain(this.state.dataRanges[axis])
      .range(targetRange)
      .clamp(true);
  }

  /**
   * Returns an object containing all data for the scatterplot
   */
  _getData() {
    const { xData, yData, zData } = this.props;
    if (!yData || !xData || !zData) { return []; }
    return mergeDatasets(xData, yData, zData);
  }

  /**
   * Gets the range for the provided dataset
   * @param {*} data 
   */
  _getDataRange(data) {
    const values = Object.keys(data)
      .map(k => parseFloat(data[k]))
      .filter(v => v > -9999)
      .sort((a, b) => a - b);
    return [
      d3array.quantile(values, 0.001), 
      d3array.quantile(values, 0.999)
    ]
  }

  /**
   * Gets the range for data on all axis
   * @param {*} data 
   */
  _getDataRanges(data) {
    return [ 'x', 'y', 'z' ].reduce((acc,curr,i) => {
      const d = Object.keys(data).map(k => data[k][i])
      acc[curr] = this._getDataRange(d)
      return acc;
    }, {})
  }

  /**
   * Gets the scatterplot data for a given ID
   * @param {string} id 
   * @param {number} i optional index to add to the data
   */
  _getDataForFeatureId(id, i = -1) {
    return this.state.scatterplotData[id] ?
      [ 
        this.state.scatterplotData[id][0], 
        this.state.scatterplotData[id][1],
        this.state.scatterplotData[id][2], 
        id, 
        i
      ] 
      : []
  }

  /**
   * Gets scatterplot data for an list of IDs
   * @param {Array<string>} ids
   */
  _getDataForFeatureIds(ids) {
    return this.state.scatterplotData ?
      ids.map((id,i) => this._getDataForFeatureId(id, i)) :
      [ ]
  }

  /**
   * Gets the configuration options for the overlay scatterplot
   */
  _getOverlayOptions() {
    const { hoveredFeature, yRange, selectedIds, selectedColors } = this.props;
    const sizeScale = this._getAxisScale('z');
    return {
      ...hoverOptions,
      yAxis: {
        ...hoverOptions.yAxis,
        ...yRange
      },
      visualMap: {
        show: false,
        type: 'piecewise',
        dimension: 4,
        pieces: [
          { value: -1, color: '#f00' },
          ...selectedIds.map((id, i) => {
            return {
              value: i,
              color: selectedColors[i]
            }
          })
        ]
      },
      series: [
        {
          id: 'hover',
          type: 'effectScatter',
          symbolSize: 10,
          itemStyle: {
            color: 'rgba(255,0,0, 1)'
          },
          data: hoveredFeature && 
            hoveredFeature.properties.id ? 
              [this._getDataForFeatureId(hoveredFeature.properties.id, -1)] : 
              []
          ,
          z: 3
        },
        {
          id: 'selected',
          type: 'scatter',
          symbolSize: (value) => sizeScale(value[2]),
          itemStyle: {
            borderWidth: 1.5,
            borderColor: '#fff',
            shadowColor: 'rgba(0,0,0,1)',
            shadowBlur: 2
          },
          data: this._getDataForFeatureIds(selectedIds)
        }
      ]
    }
  }

  /**
   * Gets the configuration options for the overlay scatterplot
   */
  _getScatterOptions() {
    const { yRange } = this.props;
    const sizeScale = this._getAxisScale('z');
    return {
      ...scatterOptions,
      visualMap: {
        ...scatterOptions.visualMap,
        ...this._getVisualMap()
      },
      yAxis: {
        ...scatterOptions.yAxis,
        ...yRange
      },
      series: [
        {
          id: 'scatter',
          name: 'scatter',
          type: 'scatter',
          data: Object.keys(this.state.scatterplotData)
            .map(k => this.state.scatterplotData[k]),
          symbolSize: (value) => sizeScale(value[2]),
          itemStyle: {
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.15)'
          },
          z:2
        }
      ]
    }
  }

  _handleMouseOver = (e) => {
    const data = e.data;
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
      x: e.event.event.clientX,
      y: e.event.event.clientY - 64
    }
    this.props.onHoverFeature(feature, coords);
    if (_isEmpty(this.props.hoveredMetaData)) {
      this.props.loadMetadataForPlace(feature.id)
    }
  }

  _handleMouseOut = () => {
    this.props.onHoverFeature(null, {x:0,y:0});
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

  _onChartReady(e) {
    // console.log(e)
    e.on('mouseover', this._handleMouseOver)
    e.on('mouseout', this._handleMouseOut)
    e.on('click', this._handleClick)
    // e.on('datarangeselected', console.log)
    this.echart = e;
  }

  componentDidMount() {
    this._loadScatterplotData();
  }

  componentDidUpdate(prevProps) {
    const { region, xVar, yVar, zVar, xData, yData, zData } = this.props;
    if (
      prevProps.region !== region ||
      prevProps.xVar !== xVar ||
      prevProps.zVar !== zVar ||
      prevProps.yVar !== yVar
    ) {
      this._loadScatterplotData();
    }
    // update the state when data changes
    if (
      (xData && yData && zData) && (
      !_isEqual(xData, prevProps.xData) ||
      !_isEqual(yData, prevProps.yData) ||
      !_isEqual(zData, prevProps.zData)
    )) {
      const scatterplotData = this._getData()
      const dataRanges = this._getDataRanges(scatterplotData)
      this.setState({
        scatterplotData,
        dataRanges
      }, () => {
        this.setState({
          baseScatterplot: this._getScatterOptions()
        })
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
            <ReactEcharts
              onChartReady={this._onChartReady.bind(this)}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              option={this.state.baseScatterplot}
            /> 
          }
          <ReactEcharts
            style={{ pointerEvents: 'none', position: 'absolute', width: '100%', height: '100%' }}
            option={this._getOverlayOptions()}
          />
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
