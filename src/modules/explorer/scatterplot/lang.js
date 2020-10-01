import {
  getSplitVarNameLabels,
  getLang,
  getPrefixLang,
  getMetricLabel,
  getDemographicLabel
} from '../selectors/lang'
import {
  isVersusFromVarNames,
  getDemographicIdFromVarName,
  getSingularRegion,
  getGapDemographics,
  getMetricIdFromVarName,
  isGapVarName
} from '../selectors'
import { titleCase } from '../../../shared/utils'

import { getStateName } from '../../../shared/utils/states'

/**
 * Returns the title for the preview chart
 * @param {*} xVar
 * @param {*} yVar
 */
export const getPreviewChartTitle = (xVar, yVar) => {
  const isVersus = isVersusFromVarNames(xVar, yVar)
  if (!isVersus)
    return (
      getMetricLabel(yVar, 'LABEL_CONCEPT') +
      ' vs. ' +
      getMetricLabel(xVar)
    )
  return (
    getMetricLabel(yVar, 'LABEL_CONCEPT') +
    ' (' +
    getDemographicLabel(yVar) +
    ' vs. ' +
    getDemographicLabel(xVar) +
    ')'
  )
}

/**
 * Returns the title for the main chart
 * @param {*} xVar
 * @param {*} yVar
 */
export const getChartTitle = (xVar, yVar, region) => {
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const primary = isVersus
    ? getDemographicIdFromVarName(yVar)
    : yVar
  // only need metric for secondary var if not vs.
  const secondary = isVersus
    ? xVar
    : getMetricIdFromVarName(xVar)
  return (
    titleCase(getPrefixLang(primary, 'LABEL')) +
    ' vs. ' +
    titleCase(getPrefixLang(secondary, 'LABEL')) +
    ' by ' +
    titleCase(getPrefixLang(region, 'LABEL_SINGULAR'))
  )
}

/**
 * Returns array of footnote strings
 * @param {string} xVar
 * @param {string} yVar
 * @param {string} region
 */
export const getFootnotes = (xVar, yVar, region, filters) => {
  const footnotes = []
  const [xDem, xMetric] = getSplitVarNameLabels(xVar)
  const [yDem, yMetric] = getSplitVarNameLabels(yVar)
  const regionSingular = getSingularRegion(region)
  const fixCase = s => s[0].toUpperCase() + s.substring(1)

  // add notes for vs charts
  if (isVersusFromVarNames(xVar, yVar)) {
    footnotes.push(
      getLang('FOOTNOTE_CHART_VS', { yDem, xDem, region }),
      getLang('FOOTNOTE_CHART_VS2', { yDem, xDem, region })
    )
  }
  // add notes for gap charts
  if (isGapVarName(yVar)) {
    const demId = getDemographicIdFromVarName(yVar)
    const gapDems = getGapDemographics(demId).map(v =>
      getPrefixLang(v, 'LABEL_STUDENTS')
    )
    const context = {
      yDem: gapDems[0],
      yMetric,
      xDem: gapDems[1],
      xMetric,
      region
    }
    footnotes.push(getLang('FOOTNOTE_CHART_GAP', context))
  }
  // add filter footnote
  // if (filters.prefix || filters.largest) {
  //   const largest = filters.largest
  //     ? `Largest ${filters.largest}`
  //     : 'All'
  //   const parentLocation = filters.prefix
  //     ? getStateName(filters.prefix)
  //     : 'U.S.'
  //   footnotes.push(
  //     getLang('FOOTNOTE_CHART_FILTER', {
  //       region,
  //       largest,
  //       parentLocation
  //     })
  //   )
  // }
  // add circle size note
  footnotes.push(
    getLang('FOOTNOTE_CHART_SIZE', { region: regionSingular })
  )
  return footnotes.map(v => fixCase(v))
}

/**
 *
 * @param {*} value
 * @param {*} metric metric to get key for (e.g. 'avg', 'avg_gap', 'grd', etc.)
 */
export const getLangKeyForAxisLabel = (value, metric) => {
  const midPoint = metric.toLowerCase() === 'grd' ? 1 : 0
  const base = 'AXIS_' + metric.toUpperCase()
  const position =
    value === midPoint
      ? '_MID'
      : value > midPoint
      ? '_HIGH'
      : '_LOW'
  const single = value === 1 ? '_SINGLE' : ''
  return base + position + single
}
