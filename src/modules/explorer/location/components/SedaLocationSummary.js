import React from 'react'
import LocationSummaryListItem from './LocationSummaryListItem'
import {
  getFormatterForVarName,
  getPredictedValue,
  getRegionFromLocationId,
  isUnavailable,
  valueToLowMidHigh
} from '../../app/selectors'
import { getMidLowHigh } from '../../app/selectors/metrics'
import { getLang } from '../../app/selectors/lang'
import {
  getKeyMetrics,
  getMetricIdsForRegion
} from '../../app/selectors/metrics'
import { ListSubheader, withStyles } from '@material-ui/core'
import { formatNumber } from '../../../../shared/utils'

/** Thresholds for below / above average */
const DIFF_RANGES = {
  avg: [-0.25, 0.25],
  grd: [-0.035, 0.035],
  coh: [-0.025, 0.025]
}

const getSesComparisonItem = (
  location,
  metricId,
  secondaryId,
  region
) => {
  const varName = ['all', metricId].join('_')
  const secondaryVar = ['all', secondaryId].join('_')
  const ses = location[secondaryVar]
  if (!location || !location[varName] || isUnavailable(ses))
    return null
  const predictedVal = getPredictedValue(ses, metricId, region)
  const diffVal = location[varName] - predictedVal
  const indicator = getMidLowHigh(diffVal, DIFF_RANGES[metricId])
  const langKey = [
    'SUMMARY',
    metricId + secondaryId,
    indicator
  ].join('_')
  const description = getLang(langKey, {
    region,
    value: formatNumber(diffVal)
  })
  return {
    metricId: metricId + secondaryId,
    indicator,
    description
  }
}

/**
 * Returns a summary object for the metrics of a location
 * @param {*} location
 * @param {*} metricId
 * @param {*} demId
 */
const getSummaryItem = (location, metricId, demId = 'all') => {
  const varName = [demId, metricId].join('_')
  if (!location || !location[varName]) return null
  const indicator = valueToLowMidHigh(
    metricId,
    location[varName]
  )
  const formatter = getFormatterForVarName(varName)
  const description = getLang(
    ['SUMMARY', metricId, indicator].join('_'),
    { value: formatter(location[varName]) }
  )
  return {
    metricId,
    indicator,
    description
  }
}

/**
 * Returns an array of summary objects for the given location
 * @param {*} location
 */
const getSummaryItems = location => {
  if (!location) return []
  const region = getRegionFromLocationId(location.id)
  const metrics = getMetricIdsForRegion(region)
  // get summary items for metrics
  const metricItems = metrics
    .map(m => getSummaryItem(location, m))
    .filter(v => !!v)
    .filter(v => !!v.description)
  const secondaryMetric = region === 'schools' ? 'frl' : 'ses'
  // get the SES comparison for key metrics for this location (if it is a county, district, or school)
  const comparisonItems =
    ['counties', 'districts', 'schools'].indexOf(region) > -1
      ? getKeyMetrics()
          .map(v =>
            getSesComparisonItem(
              location,
              v.id,
              secondaryMetric,
              region
            )
          )
          .filter(v => !!v)
      : []
  // retun the combined summary and comparison items
  return [metricItems, comparisonItems]
}

const SedaLocationSummary = ({ location, classes }) => {
  const [metricItems, comparisonItems] = getSummaryItems(
    location
  )
  return (
    <>
      <ListSubheader>
        {getLang('LOCATION_SUBHEADING_SUMMARY')}
      </ListSubheader>
      <p className={classes.category}>
        {getLang('LOCATION_SUBHEADING_SUMMARY_OVERALL')}
      </p>
      {metricItems.map(summary => (
        <LocationSummaryListItem
          key={summary.metricId}
          indicator={summary.indicator}
          description={summary.description}
        />
      ))}
      {comparisonItems.length > 0 && (
        <p className={classes.category}>
          {getLang('LOCATION_SUBHEADING_SUMMARY_COMPARED')}
        </p>
      )}
      {comparisonItems.map(summary => (
        <LocationSummaryListItem
          key={summary.metricId}
          indicator={summary.indicator}
          description={summary.description}
        />
      ))}
    </>
  )
}

SedaLocationSummary.propTypes = {}

export default withStyles(theme => ({
  category: {
    // fontSize: "0.875rem",
    // padding: "0px 24px",
    // margin: "12px 0",
    fontSize: theme.typography.pxToRem(12),
    padding: theme.spacing(0, 3),
    margin: theme.spacing(1, 0),
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.typography.pxToRem(14)
    }
  }
}))(SedaLocationSummary)
