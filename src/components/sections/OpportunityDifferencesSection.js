import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getRegionControl, getMetricControl, getDemographicControl, getHighlightControl } from '../../modules/controls';
import { getDemographicIdFromVarName, getMetricIdFromVarName } from '../../modules/config';
import { getLang } from '../../constants/lang.js';
import ScatterplotSection from '../base/ScatterplotSection';
import { sectionMapDispatchToProps } from '../../actions/sectionActions';
import { getStateFipsFromAbbr } from '../../constants/statesFips';

/**
 * Gets an array of controls for the section
 * @param {string} region 
 * @param {object} vars 
 * @param {string} highlightedState 
 */
const getSectionControls = (region, vars, highlightedState) => [
  getMetricControl(
    getMetricIdFromVarName(vars.xVar)
  ),
  getDemographicControl(
    getDemographicIdFromVarName(vars.xVar),
    'subgroupX',
    'Subgroup 1'
  ),
  getDemographicControl(
    getDemographicIdFromVarName(vars.yVar), 
    'subgroupY',
    'Subgroup 2'
  ),
  getRegionControl(region),
  getHighlightControl(highlightedState)
]

const mapStateToProps = (
  { 
    scatterplot: { data, loaded }, 
    selected,
    sections: { opportunity: { hovered, vars }, active  } 
  },
  { match: { params: { region, highlightedState } } }
) => {
  return ({
    active: Boolean(loaded['map']),
    section: {
      id: 'opportunity',
      type: 'scatterplot',
      title: getLang('OPP_DIFF_TITLE'),
      description: getLang('OPP_DIFF_DESCRIPTION'),
      headerMenu: {
        text: getLang('OPP_DIFF_CONTROL_TEXT'),
        controls: getSectionControls(region, vars, highlightedState)
      },
      selected: selected && selected[region],
      cardMetrics: [ vars.xVar, vars.yVar ],
    },
    scatterplot: {
      ...vars,
      highlightedState: getStateFipsFromAbbr(highlightedState),
      variant: 'opp',
      region,
      data,
      selected: selected && selected[region],
      hovered: hovered && 
        hovered.properties && 
        hovered.properties.id ?
          hovered.properties.id : '',
      freeze: active !== 'opportunity'
    }
  })
} 


const mapDispatchToProps = 
  sectionMapDispatchToProps('opportunity')

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ScatterplotSection)

