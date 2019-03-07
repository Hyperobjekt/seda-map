import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react';
import { getScatterplotConfig } from '../../utils/scatterplot';

export class Scatterplot extends Component {
  static propTypes = {
    options: PropTypes.object,
    onHover: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.object
  }

  _onChartReady(e) {
    e.on('mouseover', (e) => this.props.onHover(e.data, e.event))
    e.on('mouseout', (e) => this.props.onHover(null, e.event))
    e.on('click', this.props.onClick)
    this.echart = e;
  }

  render() {
    return (
      this.props.options && 
        <ReactEcharts
          onChartReady={this._onChartReady.bind(this)}
          style={{ position: 'absolute', width: '100%', height: '100%', ...this.props.style }}
          option={getScatterplotConfig(this.props.options)}
        />
    )
  }
}

export default Scatterplot
