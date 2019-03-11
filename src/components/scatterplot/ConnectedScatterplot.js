import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Scatterplot from './Scatterplot';
import { loadVarsForRegion } from '../../actions/scatterplotActions';


const getDataForId = (id, data) => 
  Object.keys(data).reduce((acc, curr) => {
    if (data[curr][id]) {
      acc[curr] = data[curr][id]
    }
    return acc;
  }, {})

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
    onReady: PropTypes.func,
    onMouseMove: PropTypes.func,
    loadVarsForRegion: PropTypes.func,
    data: PropTypes.object,
    hoveredId: PropTypes.string,
    selected: PropTypes.array,
    selectedColors: PropTypes.array
  }
  
  constructor(props) {
    super(props);
    this.hoverTimeout = null;
  }

  componentDidMount() {
    this._loadScatterplotData();
  }

  componentDidUpdate(prevProps) {
    const { region, xVar, yVar, zVar, hoveredId } = this.props;    
    // load data if needed
    if (
      prevProps.region !== region ||
      prevProps.xVar !== xVar ||
      prevProps.zVar !== zVar ||
      prevProps.yVar !== yVar
    ) {
      this._loadScatterplotData();
    }
    // update highlighted dots when hovered changes
    if (prevProps.hoveredId !== hoveredId) {
      this._toggleHighlight(prevProps.hoveredId, { show: false })
      if (hoveredId) {
        this._toggleHighlight(hoveredId, { show: true });
      }
    }
  }

  /**
   * Loads variables for a region if they do not exist in the data
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
   * Toggle highlighted state for items in the scatterplot
   */
  _toggleHighlight(hoveredId, { show = true }) {
    const { series } = this.echart.getOption();
    if (series[0] && series[0].data) {
      this.echart && this.echart.dispatchAction({
        type: show ? 'highlight' : 'downplay',
        seriesIndex: 0,
        dataIndex: getDataIndex(hoveredId, series[0].data)
      })
    } else {
      console.warn('no series to toggle highlight', series, this.echart.getOption());
    }
  }

  /**
   * Get this clicked location data and pass it to the handler
   * if it exists.
   */
  _onClick = (e) => {
    if (!this.props.onClick) { return; }
    const { data } = this.props;
    const locationData = {
      id: e.data[3],
      ...getDataForId(e.data[3], data)
    };
    this.props.onClick && this.props.onClick(locationData, e)
  }

  /**
   * Set the echart instance on ready and pass it to the onReady
   * handler if it exists
   */
  _onReady = (echart) => {
    this.echart = echart;
    if (!this.props.onReady) { return; }
    this.props.onReady(echart);
  }

  /**
   * Get the data for the hovered feature and call the
   * handler if it exists
   */
  _onHover = (e) => {
    if (!this.props.onHover) { return; }
    const { data } = this.props;
    // get the data array for the hovered location
    const hoverData = 
      e && e.data && e.data.hasOwnProperty('value') ?
        e.data['value']: e.data;
    // get the data from the state for the location
    const locationData = hoverData && e.type === 'mouseover' ? ({
      id: hoverData[3],
      ...getDataForId(hoverData[3], data)
    }) : null;
    // if there is a location then call onHover immediately
    if (locationData) {
      this.props.onHover(locationData, e);
      // clear the timeout if it is waiting to clear the hovered feature
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
    } else {
      // set a timeout to inform the callback no items are hovered
      this.hoverTimeout = setTimeout(() => {
        this.props.onHover(null, e);
      }, 200)
    }
  }

  /**
   * Call the mouse move handler if it exists
   */
  _onMouseMove = (e) => {
    if (!this.props.onMouseMove) { return; }
    this.props.onMouseMove(e);
  }

  render() {
    return (
      <Scatterplot 
        onReady={this._onReady}
        onHover={this._onHover}
        onMouseMove={this._onMouseMove}
        onClick={this._onClick}
        xVar={this.props.xVar}
        yVar={this.props.yVar}
        zVar={this.props.zVar}
        data={this.props.data}
        selected={this.props.selected}
        selectedColors={this.props.selectedColors}
        options={this.props.options}
      />  
    )
  }
}

const mapStateToProps = (
  { 
    scatterplot: { data },
    hovered: { feature },
    selected
  }, 
  { region }
) => { 
  return ({
    data: data[region],
    hoveredId: feature && feature.properties && feature.properties.id ?
      feature.properties.id : null,
    selected: selected[region],
    selectedColors: selected.colors
 })
};

const mapDispatchToProps = (dispatch) => ({
  loadVarsForRegion: (vars, region) => 
    dispatch(loadVarsForRegion(vars, region)),
})

export default connect(
  mapStateToProps, 
  mapDispatchToProps,
)(ConnectedScatterplot)
