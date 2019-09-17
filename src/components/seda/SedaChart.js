import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getScatterplotVars, isVersusFromVarNames } from '../../modules/config';
import { getStateFipsFromAbbr } from '../../constants/statesFips';
import { loadLocation, onHoverFeature, onScatterplotData, onScatterplotLoaded, onScatterplotError, onCoordsChange, setTooltipVars } from "../../actions";
import Scatterplot from '../organisms/Scatterplot';
import SedaLocationMarkers from './SedaLocationMarkers';
import ScatterplotHeading from '../organisms/Scatterplot/ScatterplotHeading';
import ScatterplotAxis from '../organisms/Scatterplot/ScatterplotAxis';

const SedaExplorerChart = ({
  region,
  metric,
  demographic,
  highlightedState,
  hovered,
  data,
  onData,
  onReady,
  onHover,
  onClick,
  onError,
}) => {
  const vars = getScatterplotVars(region, metric, demographic);
  const isVersus = isVersusFromVarNames(vars.xVar, vars.yVar);
  return (
    <Scatterplot {...{
      ...vars,
      region,
      data,
      variant: 'map',
      highlightedState: getStateFipsFromAbbr(highlightedState),
      className: isVersus ? 'scatterplot--versus': '',
      onData,
      onReady,
      onHover,
      onClick,
      onError
    }}>
      <ScatterplotHeading {...{...vars, region, highlightedState}} />
      <SedaLocationMarkers 
        {...{...vars}}
        onHover={onHover}
      />
      <ScatterplotAxis
        axis='y'
        varName={vars.yVar}
        hovered={hovered}
        region={region}
        className='scatterplot__axis scatterplot__axis--y'
      />
      <ScatterplotAxis
        axis='x'
        varName={vars.xVar}
        hovered={hovered}
        region={region}
        className='scatterplot__axis scatterplot__axis--x'
      />
    </Scatterplot>
  )
}

SedaExplorerChart.propTypes = {
  region: PropTypes.string,
  metric: PropTypes.string,
  demographic: PropTypes.string,
  highlightedState: PropTypes.string,
  hovered: PropTypes.object,
  data: PropTypes.object,
  onData: PropTypes.func,
  onReady: PropTypes.func,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onError: PropTypes.func,
}

const mapStateToProps = ({ 
  scatterplot: { data },
  sections: { hovered },
},
{ match: { params: { region, metric, secondary, demographic, highlightedState } } }
) => {
  return ({
    region,
    metric,
    secondary,
    demographic,
    highlightedState,
    hovered,
    data,
  })
}

const mapDispatchToProps = (dispatch) => ({
  onData: (data, region) =>
    dispatch(onScatterplotData(data, region)),
  onReady: () => 
    dispatch(onScatterplotLoaded('map')),
  onHover: (feature, vars, e) => {
    dispatch(onHoverFeature(feature, 'map'))
    dispatch(setTooltipVars(vars))
    dispatch(onCoordsChange({x: e.pageX, y: e.pageY }))
  },
    
  onClick: (location) =>
    dispatch(loadLocation(location, 'chart')),
  onError: (e, sectionId = 'map') =>
    dispatch(onScatterplotError(e, sectionId))
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SedaExplorerChart)

