import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getMapVars, getDemographicIdFromVarName, getGapDemographics } from '../../modules/config';
import { getStateFipsFromAbbr } from '../../constants/statesFips';
import { loadLocation, onHoverFeature, onScatterplotData, onScatterplotLoaded, onScatterplotError } from "../../actions";
import Scatterplot from '../organisms/Scatterplot';
import SedaLocationMarkers from './SedaLocationMarkers';
import ScatterplotAxis from '../organisms/Scatterplot/ScatterplotAxis';
import { GapTypeInlineMenu } from './SedaSelectControls';
import { getLabel, getLang } from '../../modules/lang';

const SedaGapChart = ({
  region,
  metric,
  demographic,
  secondary,
  highlightedState,
  hovered,
  data,
  onData,
  onReady,
  onHover,
  onClick,
  onError,
  onSetSecondary,
}) => {
  const vars = getMapVars(region, metric, demographic);
  const xDem = getDemographicIdFromVarName(vars.xVar);
  // segregation only for poor vs. non-poor
  const isPoorVsNonpoor = xDem === 'pn';
  vars.xVar = isPoorVsNonpoor ?
    'np_seg' : xDem + '_' + secondary;
  const dems = getGapDemographics(xDem).map(d => getLang('LABEL_'+d));
  const gapInputLabel = secondary === 'ses' ?
    getLang('LABEL_GAP_INPUT', { dem1: dems[0], dem2: dems[1] }) :
    getLang('LABEL_GAP_INPUT', { dem1: dems[1], dem2: dems[0] });
  return (
    <Scatterplot {...{
      ...vars,
      region,
      data,
      variant: 'map',
      highlightedState: getStateFipsFromAbbr(highlightedState),
      className: 'scatterplot--secondary',
      onData,
      onReady,
      onHover,
      onClick,
      onError
    }}>
      <div className="scatterplot__gap-selector">
        <span>{gapInputLabel} { isPoorVsNonpoor && getLabel('SEG') }</span>
        { !isPoorVsNonpoor && 
            <GapTypeInlineMenu
              metric={secondary}
              onChange={(id) => { onSetSecondary(id) }}
            />
        }
      </div>
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

SedaGapChart.propTypes = {
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
  sections: { hovered, gapChartX },
},
{ match: { params: { region, metric, demographic, highlightedState } } }
) => {
  return ({
    region,
    metric,
    secondary: gapChartX,
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
    dispatch(onHoverFeature(feature, {x: e.pageX, y: e.pageY }, vars))
    // dispatch(setTooltipVars(vars))
    // dispatch(onCoordsChange({x: e.pageX, y: e.pageY }))
  },
  onClick: (location) =>
    dispatch(loadLocation(location, 'chart')),
  onError: (e, sectionId = 'map') =>
    dispatch(onScatterplotError(e, sectionId)),
  onSetSecondary: (metric) => {
    dispatch({
      type: 'SET_GAP_CHART_X',
      metric
    })
  }
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(SedaGapChart)

