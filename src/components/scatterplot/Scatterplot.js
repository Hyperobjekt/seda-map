import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react';
import * as _isEqual from 'lodash.isequal';

export class Scatterplot extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    options: PropTypes.object,
    onHover: PropTypes.func,
    onClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      scatterplotConfig: false
    };
  }

  _onChartReady(e) {
    e.on('mouseover', (e) => this.props.onHover(e.data, e.event))
    e.on('mouseout', (e) => this.props.onHover(null, e.event))
    e.on('click', this.props.onClick)
    this.echart = e;
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (
      !_isEqual(prevProps.data, this.props.data) ||
      !_isEqual(prevProps.options, this.props.options)
    ) {
      this.setState({ 
        scatterplotConfig: {
          ...this.props.options,
          ...this.props.data,
        }
      })
    }
  }

  render() {
    return (
      this.state.scatterplotConfig && 
          <ReactEcharts
            onChartReady={this._onChartReady.bind(this)}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            option={this.state.scatterplotConfig}
          /> 
    )
  }
}

export default Scatterplot
