import React from 'react'
import LocationSummaryListItem from './LocationSummaryListItem'
import {
  getFormatterForVarName,
  getPredictedValue,
  getRegionFromLocationId,
  isUnavailable,
  valueToLowMidHigh
} from '../../app/selectors'
import { getLang } from '../../app/selectors/lang'
import {
  getKeyMetrics,
  getMetricIdsForRegion
} from '../../app/selectors/metrics'
import { ListSubheader, withStyles } from '@material-ui/core'
import { formatNumber } from '../../../../shared/utils'

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
  const diffVal =
    location[varName] - getPredictedValue(ses, metricId, region)
  const indicator = valueToLowMidHigh(metricId, diffVal)
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
  const secondaryMetric = region === 'schools' ? 'frl' : 'ses'
  // get the SES comparison for key metrics for this location
  const comparisonItems = getKeyMetrics()
    .map(v =>
      getSesComparisonItem(
        location,
        v.id,
        secondaryMetric,
        region
      )
    )
    .filter(v => !!v)
  // retun the combined summary and comparison items
  return [metricItems, comparisonItems]
}

const SedaLocationSummary = ({ location, classes }) => {
  const [metricItems, comparisonItems] = getSummaryItems(location)
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
      <p className={classes.category}>
        {getLang('LOCATION_SUBHEADING_SUMMARY_COMPARED')}
      </p>
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
