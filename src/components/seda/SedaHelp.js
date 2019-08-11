import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { getLang, getLegendEndLabelsForVarName } from '../../modules/lang';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { getChoroplethColors, isGapVarName, getInvertedFromVarName, getMetricRangeFromVarName, getFormatterForVarName, getSingularRegion, valueToLowMidHigh } from '../../modules/config';
import Panel from '../molecules/Panel';
import AccordionItem from '../molecules/AccordionItem';
import { hideHelpTopic, showHelpTopic } from '../../actions';
import LegendBar from '../molecules/LegendBar';
import usePrevious from '../../hooks/usePrevious';

/**
 * Helper function to transition scroll
 */
function easeInOutQuad(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
}

/**
 * Helper function to scroll an element to a position over time
 * @param {*} element element to scroll
 * @param {*} to top position
 * @param {*} duration time length of scroll
 */
function scrollTo(element, to, duration) {
  var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;
      
  var animateScroll = function(){        
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if(currentTime < duration) {
          setTimeout(animateScroll, increment);
      }
  };
  animateScroll();
}


const CONTEXT_TOPICS = [
  'HELP_MAP',
  'HELP_CHART',
  'HELP_AVG',
  'HELP_GRD',
  'HELP_COH',
  'HELP_SES',
  'HELP_SEG',
  'HELP_FRL',
  'HELP_AVG_CONCEPT',
  'HELP_GRD_CONCEPT',
  'HELP_COH_CONCEPT',
  'HELP_SES_CONCEPT',
]

const HOW_TOPICS = [
  'HELP_HOW_Q1',
  'HELP_HOW_Q2',
  'HELP_HOW_Q3',
  'HELP_HOW_Q4',
  'HELP_HOW_Q5',
  'HELP_HOW_Q6',
  'HELP_HOW_Q7',
  'HELP_HOW_Q8',
  'HELP_HOW_Q9',
  'HELP_HOW_Q10',
  'HELP_HOW_Q11',
  'HELP_HOW_Q12',
]

const COLORS = getChoroplethColors();

const HelpChart = withRouter(({id, match, expanded, onChange}) => {
  const { region, metric } = match.params;
  return (
    <AccordionItem
      id={id}
      heading={getLang(id)}
      htmlContent={getLang('HELP_CHART_' + metric, { region: getSingularRegion(region) })}
      expanded={expanded}
      onChange={onChange}
    ></AccordionItem>
  )
})

const HelpMap = withRouter(({id, match, expanded, onChange}) => {
  const { region, demographic, metric } = match.params;
  const varName = demographic + '_' + metric;
  const colors = isGapVarName(varName) ? 
    [...COLORS].reverse() : COLORS;
  const invert = getInvertedFromVarName(varName);
  const [ startLabel, endLabel ] = getLegendEndLabelsForVarName(varName, 'HELP_LEGEND_');
  const colorRange = getMetricRangeFromVarName(varName, region, 'map');
  
  // formatter function for legend
  const formatter = (value) => {
    const numFormat = getFormatterForVarName(varName);
    const lowMidHigh = valueToLowMidHigh(metric, value);
    const langKey = 'HELP_LEGEND_VAL_' + metric + '_' + lowMidHigh
    return getLang(langKey, {
      value: numFormat(value),
      students: getLang('LABEL_STUDENTS_' + demographic)
    })
  }
  return (
    <AccordionItem
      id={id}
      heading={getLang(id)}
      expanded={expanded}
      onChange={onChange}
    >
      <div>
        <Typography className="help-legend__metric">{getLang('TAB_CONCEPT_' + metric)}</Typography>
        <Typography className="help-legend__concept">{getLang('TAB_METRIC_' + metric)}</Typography>
        <LegendBar
          vertical={true}
          formatter={formatter}
          invert={invert}
          colors={colors}
          colorRange={colorRange}
          legendRange={colorRange}
          startLabel={startLabel}
          endLabel={endLabel}
          className='help-legend'
        />
      </div>
    </AccordionItem>
  )
})


const HelpTopic = ({id, ...rest}) => {
  return (
    <AccordionItem
      id={id}
      heading={getLang(id)}
      htmlContent={getLang(id + "_A")}
      {...rest}
    ></AccordionItem>
  )
}

const HelpSection = ({heading, topics = [], expanded, onChange}) => {
  return (
    <div className="help-content__section">
      <Typography variant="overline" className="help-content__section-title">
        { heading }
      </Typography>
      {
        topics && topics.map((tId, i) => {
          switch(tId) {
            case 'HELP_MAP':
              return <HelpMap 
                key={tId} 
                id={tId} 
                onChange={onChange}
                expanded={expanded.indexOf(tId) > -1}
              />
            case 'HELP_CHART':
              return <HelpChart 
                key={tId} 
                id={tId} 
                onChange={onChange}
                expanded={expanded.indexOf(tId) > -1}
              />
            default:
              return <HelpTopic
                key={tId}
                id={tId}
                onChange={onChange}
                expanded={expanded.indexOf(tId) > -1}
              />
          }
        })
      }
    </div>
  )
}

/**
 * Get help topics based on the current context
 * @param {string} view 
 * @param {string} metric 
 * @param {string} secondary 
 */
const getCurrentViewTopics = (view, metric, secondary) => {
  const topics = [];
  if (view === 'split') { topics.push('HELP_MAP', 'HELP_CHART') }
  if (view === 'map') { topics.push('HELP_MAP') }
  if (view === 'chart') { topics.push('HELP_CHART') }
  topics.push(
    ...CONTEXT_TOPICS.filter(t => t.includes(metric.toUpperCase())),
    ...CONTEXT_TOPICS.filter(t => t.includes(secondary.toUpperCase()))
  )
  return topics;
}

/**
 * Get help topics that are not in the current context
 */
const getRemainingTopics = (currentTopics) => {
  return CONTEXT_TOPICS.filter(t =>
    currentTopics.indexOf(t) === -1
  )
}

const SedaHelp = ({
  open,
  region, 
  demographic, 
  metric, 
  view, 
  secondary = 'ses',
  onClose,
  onTopicToggle,
  help
}) => {
  
  /** context for populating help (not currently used, but may be needed later) */

  // const isGap = isGapDemographic(demographic)

  // const context = {
  //   demographic1: isGap && demographic[1],
  //   demographic2: isGap && demographic[0],
  //   demographic,
  //   region, 
  //   metric,
  //   secondary
  // }

  /** Help Topics */
  
  const currentTopics = getCurrentViewTopics(view, metric, secondary);
  const otherTopics = getRemainingTopics(currentTopics);
  const handleToggleTopic = (topicId) => onTopicToggle(topicId, help)

  /** Auto Scroll */

  // ref for the panel scrollable div
  const ref = useRef(null);
  // track previous to get newly expanded topics
  const prev = usePrevious(help);
  // effect to scroll to selected items
  useEffect(() => {
    if (prev && help && ref) {
      const newTopic = help.filter(tId => prev.indexOf(tId) === -1);
      if (newTopic.length === 1) {
        const topicEl = document.getElementById(newTopic[0]);
        setTimeout(() =>
          scrollTo(ref.current, topicEl.offsetTop - ref.current.offsetTop, 200)
        , 200);
      }
    }
  }, [ help ])

  /** Template */

  return (
    <Panel
      title={<Typography variant="h5">Help</Typography>}
      open={open} 
      onClose={onClose} 
      classes={{root: 'panel--help'}}
      ref={ref}
    >
      <div className="help-content">
        <HelpSection
          heading={ getLang('HELP_CURRENT') }
          topics={currentTopics}
          expanded={help}
          onChange={handleToggleTopic}
        />
        <HelpSection
          heading={ getLang('HELP_HOW_TO') }
          topics={HOW_TOPICS}
          expanded={help}
          onChange={handleToggleTopic}
        />
        <HelpSection
          heading={ getLang('HELP_OTHER') }
          topics={otherTopics}
          expanded={help}
          onChange={handleToggleTopic}
        />
      </div>
    </Panel>
    
  )
}

const mapStateToProps = (
  { help, ui: { helpOpen } },
  { match: { params: { region, demographic, metric, view }}}
) => ({
  open: helpOpen,
  region, 
  demographic, 
  metric, 
  view,
  help
})

const mapDispatchToProps = (dispatch) => ({
  onClose: () => {
    dispatch({
      type: 'TOGGLE_HELP',
      open: false
    })
  },
  onTopicToggle: (topicId, expanded) => {
    expanded.indexOf(topicId) > -1 ?
      dispatch(hideHelpTopic(topicId)) :
      dispatch(showHelpTopic(topicId))
  }
})


export default compose(
  withRouter,
  connect(
    mapStateToProps, 
    mapDispatchToProps
  )
)(SedaHelp)
