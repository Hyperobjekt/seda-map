import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Scatterplot from '../scatterplot/Scatterplot';
import { getScatterplotData, getDataScale } from '../../utils';
import { scatterOptions } from '../../constants/scatterOptions';
import * as _isEmpty from 'lodash.isempty';
import { onHoverFeature, onViewportChange, onCoordsChange } from '../../actions/mapActions';
import { fetchResults } from '../../actions/searchActions';
import { loadLocation } from '../../actions/featuresActions';
import { loadVarsForRegion } from '../../actions/scatterplotActions';
import * as _debounce from 'lodash.debounce';
import * as _isEqual from 'lodash.isequal';

/** Get series with default styles and selected areas */
const getBaseSeries = (data, selected, x, y, z) => { 
  const sizeScale = 
    getDataScale(data[z], { range: [ 5, 40 ] });
  const scatterData = getScatterplotData(data[x], data[y], data[z]);
  return {
    id: 'scatter',
    type: 'scatter',
    data: scatterData,
    symbolSize: (value) => sizeScale(value[2]),
    itemStyle: {
      'emphasis': {
        color: '#f00',
        borderColor: '#ff0000',
        borderWidth: 2
      }
    },
    markPoint: {
      data: Object.keys(selected).map((id) => {
        const point = scatterData.find(d => d[3] === id);
        return {
          name: id,
          coord: [point[0], point[1]],
          symbol: 'circle',
          symbolSize: sizeScale(point[2]),
          itemStyle: {
            borderColor: selected[id],
            borderWidth: 2,
            color: 'rgba(0,0,0,0)',
            shadowColor: '#fff',
            shadowBlur: 2
          }
        }
      })
    }
  }
}

/**
 * Gets scatterplot data series based on state and props
 * @param {*} state 
 * @param {*} props 
 */
const getScatterplotSeries = (data, selected, x, y, z) => { 
  if (data && data[x] && data[y] && data[z]) {
    return [
      getBaseSeries(data, selected, x, y, z)
    ];
  }
  return [];
}


const getDataIndex = (id, series) => {
  return series.findIndex(d => d[3] === id)
}

export class ConnectedScatterplot extends Component {
  static propTypes = {
    series: PropTypes.array,
    xVar: PropTypes.string,
    yVar: PropTypes.string,
    zVar: PropTypes.string,
    region: PropTypes.string,
    options: PropTypes.object,
    onHover: PropTypes.func,
    onClick: PropTypes.func,
    hoveredFeature: PropTypes.object,
    onHoverFeature: PropTypes.func,
    loadMetadataForPlace: PropTypes.func,
    hoveredMetaData: PropTypes.object,
    updateMapViewport: PropTypes.func,
    addSelectedLocation: PropTypes.func,
    loadVarsForRegion: PropTypes.func,
    data: PropTypes.object,
    hoveredId: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = { options: {} };
  }

  componentDidMount() {
    this._loadScatterplotData();
    this.setState({
      options: this._getScatterplotOptions()
    });
  }

  componentDidUpdate(prevProps) {
    const { region, xVar, yVar, zVar, series, hoveredId, selected } = this.props;    
    // load data if needed
    if (
      prevProps.region !== region ||
      prevProps.xVar !== xVar ||
      prevProps.zVar !== zVar ||
      prevProps.yVar !== yVar
    ) {
      this._loadScatterplotData();
    }
    // update the options in state when props change
    if (
      prevProps.series.length !== series.length ||
      prevProps.region !== region ||
      prevProps.xVar !== xVar ||
      prevProps.zVar !== zVar ||
      prevProps.yVar !== yVar ||
      !_isEqual(prevProps.selected, selected)
    ) {
      this.setState({
        options: this._getScatterplotOptions()
      });
    }
    // update highlighted dots when hovered changes
    if (prevProps.hoveredId !== hoveredId) {
      this._removeHighlight(prevProps.hoveredId)
      if (hoveredId) {
        this._addHighlight(hoveredId);
      }
    }
  }

  /**
   * Gets the options with series data for the scatterplot
   * @param {array} series data series array for scatterplot
   * @param {object} overrides option overrides to defaults
   */
  _getScatterplotOptions = () => {
    const { options, series } = this.props;
    const fullOptions = { 
      ...scatterOptions, 
      ...options,
      series 
    };
    return fullOptions;
  }

  /**
   * 
   */
  _loadScatterplotData() {
    const { data, region, xVar, yVar, zVar, loadVarsForRegion } = this.props;
    const vars = [];
    zVar && (!data || !data[zVar]) && vars.push(zVar);
    xVar && (!data || !data[xVar]) && vars.push(xVar);
    yVar && (!data || !data[yVar]) && vars.push(yVar);
    if (vars.length === 0) { return; }
    loadVarsForRegion(vars, region);
  }

  /**
   * Adds a highlight on the item with the corresponding ID
   */
  _addHighlight(hoveredId) {
    const { series } = this.props;
    if (this.echart && hoveredId) {
      this.echart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: getDataIndex(hoveredId, series[0].data)
      })
    }
  }

  /**
   * Removes highlighted items from the scatterplot
   */
  _removeHighlight(hoveredId) {
    const { series } = this.props;
    this.echart && this.echart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: getDataIndex(hoveredId, series[0].data)
    })
  }

  /**
   * Add location to selected list on click
   */
  _handleClick = (e) => {
    const { updateMapViewport, hoveredFeature, hoveredMetaData } = this.props;
    if (!_isEmpty(this.props.hoveredMetaData)) {
      this.props.addSelectedLocation({
        id: hoveredMetaData.id,
        latitude: hoveredMetaData.lat,
        longitude: hoveredMetaData.lon
      })
      updateMapViewport(hoveredFeature, hoveredMetaData)
    }
    this.props.onClick && this.props.onClick(e)
  }

  /**
   * Set hovered feature and load metadata for location
   * when hovering dots
   */
  _handleHover = _debounce((data) => {
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
    this.props.onHoverFeature(feature);
    if (_isEmpty(this.props.hoveredMetaData)) {
      this.props.loadMetadataForPlace(feature.id)
    }
    this.props.onHover && this.props.onHover(data);
  }, 40);

  _onReady = (echart) => {
    this.echart = echart;
  }

  _onHover = (data, e) => {
    // remove any old hovered features sticking around
    if(data && data[3]) {
      this.props.onHoverFeature(null)
    }
    
    // call debounced hover function
    this._handleHover(data, e);
  }

  _onMouseMove = (e) => {
    this.props.onCoordsChange({
      x: e.event.event.clientX, y: e.event.event.clientY
    })
  }

  render() {
    return (
      <Scatterplot 
        onReady={this._onReady}
        onHover={this._onHover}
        onMouseMove={this._onMouseMove}
        onClick={this._handleClick}
        options={this.state.options}
      />  
    )
  }
}

const mapStateToProps = (
  { 
    scatterplot: { data },
    hovered: { feature },
    search: { results },
    selected
  }, 
  { xVar, yVar, zVar = 'sz', region }
) => { 
  // map selected IDs to colors
  const selectedMap = selected[region] && selected.colors ? 
    selected[region].reduce((acc, curr, i) => ({
      ...acc,
      [curr]: selected.colors[i % selected.colors.length]
    }), {}) : {}
  return ({
    series: getScatterplotSeries(data[region], selectedMap, xVar, yVar, zVar),
    data: data[region],
    hoveredId: feature && feature.properties && feature.properties.id ?
      feature.properties.id : null,
    hoveredFeature: feature ? feature : null,
    hoveredMetaData: feature && results[feature.properties.id] ? 
      results[feature.properties.id] : {},
    selected: selectedMap
 })
};

const mapDispatchToProps = (dispatch) => ({
  onHoverFeature: (feature) =>
    dispatch(onHoverFeature(feature)),
  onCoordsChange: (coords) =>
    dispatch(onCoordsChange(coords)),
  loadMetadataForPlace: (id) =>
    dispatch(fetchResults(id)),
  loadVarsForRegion: (vars, region) => 
    dispatch(loadVarsForRegion(vars, region)),
  addSelectedLocation: (location) => (
    dispatch(loadLocation(location))
  ),
  updateMapViewport: (feature, meta) =>
  meta ?
    dispatch(onViewportChange({ 
      latitude: parseFloat(meta.lat), 
      longitude: parseFloat(meta.lon),
      zoom: feature.id.length+2
    }, true)) : null
})

export default connect(
  mapStateToProps, 
  mapDispatchToProps,
)(ConnectedScatterplot)
