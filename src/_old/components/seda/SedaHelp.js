import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {
  getLang,
  getLegendEndLabelsForVarName
} from '../../shared/selectors/lang'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import {
  getChoroplethColors,
  isGapVarName,
  getInvertedFromVarName,
  getMetricRangeFromVarName,
  getFormatterForVarName,
  getSingularRegion,
  valueToLowMidHigh,
  getGapDemographics,
  getMidpointForVarName,
  isGapDemographic
} from '../../shared/selectors'
import Panel from '../molecules/Panel'
import AccordionItem from '../molecules/AccordionItem'
import { hideHelpTopic, showHelpTopic } from '../../actions'
// import LegendBar from '../../modules/scatterplot/components/LegendBar'
import usePrevious from '../../shared/hooks/usePrevious'
import { getStateNameFromAbbr } from '../../shared/selectors/states'

/**
 * Helper function to transition scroll
 */
function easeInOutQuad(t, b, c, d) {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
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
    increment = 20

  var animateScroll = function() {
    currentTime += increment
    var val = easeInOutQuad(currentTime, start, change, duration)
    element.scrollTop = val
    if (currentTime < duration) {
      setTimeout(animateScroll, increment)
    }
  }
  animateScroll()
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
  'HELP_MIN',
  'HELP_AVG_CONCEPT',
  'HELP_GRD_CONCEPT',
  'HELP_COH_CONCEPT'
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
  'HELP_HOW_Q12'
]

const COLORS = getChoroplethColors()

const HelpNonGapChart = withRouter(({ match }) => {
  const {
    region,
    demographic,
    metric,
    highlightedState
  } = match.params
  const varName = demographic + '_' + metric
  const colors = COLORS
  const invert = getInvertedFromVarName(varName)
  const colorRange = getMetricRangeFromVarName(
    varName,
    region,
    'map'
  )
  const legendRange = getMetricRangeFromVarName(varName, region)
  const secondary = region === 'schools' ? 'frl' : 'ses'
  const descriptionLang = getLang('HELP_CHART_Y', {
    region,
    metric: getLang('HELP_DESC_' + metric),
    demographic:
      demographic === 'all'
        ? 'students'
        : getLang('LABEL_STUDENTS_' + demographic),
    state:
      highlightedState === 'us'
        ? 'the U.S.'
        : getStateNameFromAbbr(highlightedState),
    metricDescription: getLang(
      'HELP_DESC_' + metric + '_DETAILS'
    )
  })
  // formatter function for legend
  const formatter = value => {
    const numFormat = getFormatterForVarName(varName)
    // hack to override mid value
    value = metric === 'grd' && value === 0 ? 1 : value
    const lowMidHigh = valueToLowMidHigh(metric, value)
    const langKey =
      'HELP_LEGEND_VAL_' + metric + '_' + lowMidHigh
    return getLang(langKey, {
      value: numFormat(value),
      students: getLang('LABEL_STUDENTS_' + demographic)
    })
  }
  return (
    <div>
      <Typography paragraph={true}>{descriptionLang}</Typography>
      {/* <LegendBar
        vertical={true}
        formatter={formatter}
        invert={invert}
        colors={colors}
        colorRange={colorRange}
        legendRange={legendRange}
        className="help-legend"
      /> */}
      <Typography paragraph={true}>
        {getLang('HELP_CHART_X_' + secondary, {
          region: getSingularRegion(region)
        })}
      </Typography>
      <Typography paragraph={true}>
        {getLang('HELP_CHART_DOTS', {
          region: getSingularRegion(region),
          demographic: getLang('LABEL_' + demographic)
        })}
      </Typography>
    </div>
  )
})

const HelpGapChart = ({
  match,
  secondary = 'ses',
  secondaryOn
}) => {
  const {
    region,
    demographic,
    metric,
    highlightedState
  } = match.params
  const dems = getGapDemographics(demographic)
  const context = {
    gap: getLang('LABEL_' + demographic),
    demographic1: getLang('LABEL_' + dems[0]),
    demographic2: getLang('LABEL_' + dems[1]),
    metric: getLang('LABEL_' + metric),
    metricRange: getLang('HELP_DESC_' + metric),
    metricDescription: getLang(
      'HELP_DESC_' + metric + '_DETAILS'
    ),
    secondary: getLang('LABEL_' + secondary, { region: ' ' }),
    state:
      highlightedState === 'us'
        ? 'the U.S.'
        : getStateNameFromAbbr(highlightedState),
    region: getSingularRegion(region)
  }
  return (
    <div>
      <Typography paragraph={true}>
        {getLang('HELP_CHART_PRIMARY', context)}
      </Typography>
      {secondaryOn && (
        <Typography paragraph={true}>
          {getLang('HELP_CHART_SECONDARY', context)}
        </Typography>
      )}
    </div>
  )
}

const ConnectedHelpGapChart = compose(
  withRouter,
  connect(
    ({ sections: { gapChart, gapChartX } }) => ({
      secondary: gapChartX,
      secondaryOn: gapChart
    }),
    null
  )
)(HelpGapChart)

const HelpChart = withRouter(
  ({ id, match, expanded, onChange }) => {
    const { demographic, metric } = match.params
    const varName = demographic + '_' + metric
    const isGap = isGapVarName(varName)
    return (
      <AccordionItem
        id={id}
        heading={getLang(id)}
        expanded={expanded}
        onChange={onChange}>
        {isGap ? <ConnectedHelpGapChart /> : <HelpNonGapChart />}
      </AccordionItem>
    )
  }
)

const HelpMap = withRouter(
  ({ id, match, expanded, onChange }) => {
    const {
      region,
      demographic,
      metric,
      highlightedState
    } = match.params
    const varName = demographic + '_' + metric
    const colors = isGapVarName(varName)
      ? [...COLORS].reverse()
      : COLORS
    const invert = getInvertedFromVarName(varName)
    const [startLabel, endLabel] = getLegendEndLabelsForVarName(
      varName,
      'HELP_LEGEND_'
    )
    const colorRange = getMetricRangeFromVarName(
      varName,
      region,
      'map'
    )
    const legendRange = getMetricRangeFromVarName(
      varName,
      region
    )
    const isGap = isGapVarName(varName)
    const descriptionLang = isGap
      ? getLang('HELP_MAP_DESC_GAP', {
          region,
          gap: getLang('LABEL_' + demographic),
          metric: getLang('LABEL_' + metric),
          state:
            highlightedState === 'us'
              ? 'the U.S.'
              : getStateNameFromAbbr(highlightedState)
        })
      : getLang('HELP_MAP_DESC', {
          region,
          metric: getLang('HELP_DESC_' + metric),
          demographic:
            demographic === 'all'
              ? 'students'
              : getLang('LABEL_STUDENTS_' + demographic),
          state:
            highlightedState === 'us'
              ? 'the U.S.'
              : getStateNameFromAbbr(highlightedState),
          metricDescription: getLang(
            'HELP_DESC_' + metric + '_DETAILS'
          )
        })
    // formatter function for legend
    const formatter = value => {
      const numFormat = getFormatterForVarName(varName)
      const midPoint = getMidpointForVarName(varName)
      // hack to override mid value
      value = metric === 'grd' && value === 0 ? 1 : value
      const lowMidHigh = valueToLowMidHigh(metric, value)
      const dems = isGap
        ? getGapDemographics(demographic)
        : [demographic]
      const dem = isGap
        ? value > midPoint
          ? dems[0]
          : dems[1]
        : dems[0]
      const langKey = isGap
        ? 'HELP_LEGEND_VAL_' + metric + '_GAP_' + lowMidHigh
        : 'HELP_LEGEND_VAL_' + metric + '_' + lowMidHigh
      return getLang(langKey, {
        value: numFormat(value),
        students: getLang('LABEL_STUDENTS_' + dem)
      })
    }
    return (
      <AccordionItem
        id={id}
        heading={getLang(id)}
        expanded={expanded}
        onChange={onChange}>
        <div>
          <Typography paragraph={true}>
            {descriptionLang}
          </Typography>
          {/* <LegendBar
          vertical={true}
          formatter={formatter}
          invert={invert}
          colors={colors}
          colorRange={colorRange}
          legendRange={legendRange}
          startLabel={startLabel}
          endLabel={endLabel}
          className="help-legend"
        /> */}
          <Typography paragraph={true}>
            {getLang('HELP_DATA_OVERVIEW')}
          </Typography>
          <Typography paragraph={true}>
            {getLang('HELP_MAP_' + metric + '_OVERVIEW')}
          </Typography>
        </div>
      </AccordionItem>
    )
  }
)

const HelpTopic = ({ id, ...rest }) => {
  return (
    <AccordionItem
      id={id}
      heading={getLang(id)}
      htmlContent={getLang(id + '_A')}
      {...rest}
    />
  )
}

const HelpSection = ({
  heading,
  topics = [],
  expanded,
  onChange
}) => {
  return (
    <div className="help-content__section">
      <Typography
        variant="overline"
        className="help-content__section-title">
        {heading}
      </Typography>
      {topics &&
        topics.map((tId, i) => {
          switch (tId) {
            case 'HELP_MAP':
              return (
                <HelpMap
                  key={tId}
                  id={tId}
                  onChange={onChange}
                  expanded={expanded.indexOf(tId) > -1}
                />
              )
            case 'HELP_CHART':
              return (
                <HelpChart
                  key={tId}
                  id={tId}
                  onChange={onChange}
                  expanded={expanded.indexOf(tId) > -1}
                />
              )
            default:
              return (
                <HelpTopic
                  key={tId}
                  id={tId}
                  onChange={onChange}
                  expanded={expanded.indexOf(tId) > -1}
                />
              )
          }
        })}
    </div>
  )
}

/**
 * Get help topics based on the current context
 * @param {string} view
 * @param {string} metric
 * @param {string} secondary
 */
const getCurrentViewTopics = (
  view,
  metric,
  secondary,
  demographic
) => {
  if (!metric || !secondary || !view) {
    return []
  }
  const topics = []
  if (view === 'split') {
    topics.push('HELP_MAP', 'HELP_CHART')
  }
  if (view === 'map') {
    topics.push('HELP_MAP')
  }
  if (view === 'chart') {
    topics.push('HELP_CHART')
  }
  topics.push(
    ...CONTEXT_TOPICS.filter(t =>
      t.includes(metric.toUpperCase())
    ),
    ...CONTEXT_TOPICS.filter(t =>
      t.includes(secondary.toUpperCase())
    )
  )
  if (isGapDemographic(demographic)) {
    topics.push('HELP_SEG')
  }
  return topics
}

/**
 * Get help topics that are not in the current context
 */
const getRemainingTopics = currentTopics => {
  return CONTEXT_TOPICS.filter(
    t => currentTopics.indexOf(t) === -1
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
  /** Help Topics */

  const currentTopics = getCurrentViewTopics(
    view,
    metric,
    secondary,
    demographic
  )
  const otherTopics = getRemainingTopics(currentTopics)
  const handleToggleTopic = topicId =>
    onTopicToggle(topicId, help)

  /** Auto Scroll */

  // ref for the panel scrollable div
  const ref = useRef(null)
  // track open state to give focus
  const prevOpen = usePrevious(open)
  // track previous to get newly expanded topics
  const prev = usePrevious(help)

  // effect to give proper focus on open / close
  useEffect(() => {
    if (!prevOpen && open) {
      document.getElementById('helpClose').focus()
    }
    if (prevOpen && !open) {
      document.getElementById('helpToggle').focus()
    }
  }, [open, prevOpen])

  // effect to scroll to selected items
  useEffect(() => {
    if (prev && help && ref) {
      const newTopic = help.filter(
        tId => prev.indexOf(tId) === -1
      )
      if (newTopic.length === 1) {
        const topicEl = document.getElementById(newTopic[0])
        topicEl.focus()
        setTimeout(
          () =>
            scrollTo(
              ref.current,
              topicEl.offsetTop - ref.current.offsetTop,
              200
            ),
          200
        )
      }
    }
  }, [prev, help])

  /** Template */

  return (
    <Panel
      id="helpPanel"
      title={<Typography variant="h5">Help</Typography>}
      open={open}
      onClose={onClose}
      classes={{ root: 'panel--help' }}
      closeId="helpClose"
      ref={ref}>
      <div className="help-content">
        <HelpSection
          heading={getLang('HELP_CURRENT')}
          topics={currentTopics}
          expanded={help}
          onChange={handleToggleTopic}
        />
        <HelpSection
          heading={getLang('HELP_HOW_TO')}
          topics={HOW_TOPICS}
          expanded={help}
          onChange={handleToggleTopic}
        />
        <HelpSection
          heading={getLang('HELP_OTHER')}
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
  {
    match: {
      params: { region, demographic, metric, view, secondary }
    }
  }
) => ({
  open: helpOpen,
  region,
  secondary,
  demographic,
  metric,
  view,
  help
})

const mapDispatchToProps = dispatch => ({
  onClose: () => {
    dispatch({
      type: 'TOGGLE_HELP',
      open: false
    })
  },
  onTopicToggle: (topicId, expanded) => {
    expanded.indexOf(topicId) > -1
      ? dispatch(hideHelpTopic(topicId))
      : dispatch(showHelpTopic(topicId))
  }
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SedaHelp)
