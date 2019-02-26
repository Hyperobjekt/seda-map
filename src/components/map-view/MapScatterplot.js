import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {FlyToInterpolator} from 'react-map-gl';
// 3rd-party easing functions
import * as ease from 'd3-ease';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
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

export class MapScatterplot extends Component {
  static propTypes = {
    region: PropTypes.string,
    yVar: PropTypes.string,
    xVar: PropTypes.string,
    metric: PropTypes.object,
    hoveredFeature: PropTypes.object
  }

  _loadScatterplotData() {
    const { xVar, yVar, xData, yData, region, loadVarsForRegion } = this.props;
    const vars = [];
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
        color: colors
      }
    }
  }

  _getDataForFeatureId(id) {
    const { xData, yData } = this.props;
    return xData && yData ?
      [ [ xData[id], yData[id] ] ] :
      [ ]
  }

  _getOverlayOptions() {
    const { hoveredFeature, yRange } = this.props;
    return {
      ...hoverOptions,
      yAxis: {
        ...hoverOptions.yAxis,
        ...yRange
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
              this._getDataForFeatureId(hoveredFeature.properties.id) : 
              []
          ,
          z: 3
        }
      ]
    }
  }

  _getData() {
    const { xData, yData } = this.props;
    if (!yData || !xData) { return []; }
    const data = mergeDatasets(xData, yData);
    return Object.keys(data).map(k => data[k]);
  }

  _getScatterOptions() {
    const { yRange } = this.props;
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
          data: this._getData(),
          z:2
        }
      ]
    }
  }

  _handleMouseOver = (e) => {
    const data = e.data;
    const feature = {
      id: data[2],
      properties: {
        id: data[2],
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

  _handleMouseOut = (e) => {
    this.props.onHoverFeature(null, {x:0,y:0});
  }

  _handleClick = (e) => {
    const { updateMapViewport, hoveredFeature, hoveredMetaData } = this.props;
    updateMapViewport(hoveredFeature, hoveredMetaData)
  }

  _onChartReady(e) {
    // console.log(e)
    e.on('mouseover', this._handleMouseOver)
    e.on('mouseout', this._handleMouseOut)
    e.on('click', this._handleClick)
    e.on('datarangeselected', console.log)
    this.echart = e;
  }

  componentDidMount() {
    this._loadScatterplotData();
  }

  componentDidUpdate(prevProps) {
    const { region, xVar, yVar } = this.props;
    if (
      prevProps.region !== region ||
      prevProps.xVar !== xVar ||
      prevProps.yVar !== yVar
    ) {
      this._loadScatterplotData();
    }
  }

  render() {
    return (
      <Paper className='map-scatterplot'>
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
          <ReactEcharts
            onChartReady={this._onChartReady.bind(this)}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            option={this._getScatterOptions()}

          />
          <ReactEcharts
            style={{ pointerEvents: 'none', position: 'absolute', width: '100%', height: '100%' }}
            option={this._getOverlayOptions()}
          />
        </div>
      </Paper>
    )
  }
}

const mapStateToProps = ({
  hovered: { feature },
  scatterplot, 
  metrics,
  search: { results }
}, {
  match: { params: { region, metric } }
}) => { 
  region = (region === 'schools' ? 'districts' : region);
  return ({
    region,
    yVar: 'all_' + metric,
    xData: getRegionData(scatterplot, region, 'all_ses'),
    yData: getRegionData(scatterplot, region, 'all_' + metric),
    yRange: getPaddedMinMax(metrics, metric, 2),
    xVar: 'all_ses',
    colors: metrics.colors,
    metric: metrics.items[metric],
    hoveredFeature: feature ? feature : null,
    hoveredMetaData: feature && results[feature.properties.id] ? 
       results[feature.properties.id] : {}
  })
}

const mapDispatchToProps = (dispatch) => ({
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
        zoom: feature.id.length+2,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      })) : null
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MapScatterplot)
