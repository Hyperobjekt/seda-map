import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Scatterplot from '../scatterplot/Scatterplot';
import { getScatterplotData, getDataScale } from '../../utils';
import { scatterOptions } from '../../constants/scatterOptions';

/**
 * Gets scatterplot data series based on state and props
 * @param {*} state 
 * @param {*} props 
 */
const getScatterplotSeries = (
  { scatterplot: { data } }, 
  { xVar, yVar, zVar = 'sz', region }
) => { 
  if (
    data[region] && data[region][xVar] &&
    data[region][yVar] && data[region][zVar]
  ) {
    const sizeScale = getDataScale(
      data[region][zVar],
      { range: [ 5, 40 ] }
    );
    return [
      {
        id: 'scatter',
        type: 'scatter',
        data: getScatterplotData(
          data[region][xVar],
          data[region][yVar],
          data[region][zVar]
        ),
        symbolSize: (value) => sizeScale(value[2])
      }
    ];
  }
  return [];
}

/**
 * Gets the options with series data for the scatterplot
 * @param {array} series data series array for scatterplot
 * @param {object} overrides option overrides to defaults
 */
const getScatterplotOptions = (series, overrides) => {
  const options = { 
    ...scatterOptions, 
    ...overrides, 
    series 
  };
  return options;
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
    onClick: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = { options: {} };
  }

  componentDidMount() {
    const { series, options } = this.props;
    this.setState({
      options: getScatterplotOptions(series, options)
    });
  }

  componentDidUpdate(prevProps) {
    const { region, xVar, yVar, zVar, series, options } = this.props;
    // update the state when data is available
    if (
      prevProps.series.length !== series.length ||
      prevProps.region !== region ||
      prevProps.xVar !== xVar ||
      prevProps.zVar !== zVar ||
      prevProps.yVar !== yVar
    ) {
      this.setState({
        options: getScatterplotOptions(series, options)
      });
    }
  }

  render() {
    const { onHover, onClick } = this.props;
    return (
      <Scatterplot 
        onHover={onHover}
        onClick={onClick}
        options={this.state.options}
      />  
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  series: getScatterplotSeries(state, ownProps)
});

export default connect(
  mapStateToProps, 
  null
)(ConnectedScatterplot)
