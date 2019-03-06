import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Scatterplot from '../scatterplot/Scatterplot';
import { mergeDatasets } from '../../utils/index';
import { scatterOptions } from '../../constants/scatterOptions';


/**
 * Gets scatterplot data based on state and props
 * @param {*} state 
 * @param {*} props 
 */
const getScatterplotData = (
  { scatterplot: { data } }, 
  { xVar, yVar, zVar = 'sz', region }
) => 
  mergeDatasets(
    data[region][xVar],
    data[region][yVar],
    data[region][zVar]
  )

const ConnectedScatterplot = ({data, onHover, onClick}) => 
  <Scatterplot 
    data={data}
    onHover={onHover}
    onClick={onClick}
    options={scatterOptions}
  />

ConnectedScatterplot.propTypes = {
  data: PropTypes.array,
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  region: PropTypes.string,
  onHover: PropTypes.func,
  onClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  data: getScatterplotData(state, ownProps)
})

const mapDispatchToProps = {
  onHover: () => {},
  onClick: () => {}
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ConnectedScatterplot)
