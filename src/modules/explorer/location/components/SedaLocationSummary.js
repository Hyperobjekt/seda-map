import React from 'react'
import LocationSummaryListItem from './LocationSummaryListItem'
import {
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
import { ListSubheader } from '@material-ui/core'

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
  const langKey = ['SUMMARY', metricId + secondaryId, indicator].join('_')
  const description = getLang(langKey, { region })
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
  const description = getLang(
    ['SUMMARY', metricId, indicator].join('_')
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
  return [...metricItems, ...comparisonItems]
}

const SedaLocationSummary = ({ location }) => {
  const summaryItems = getSummaryItems(location)
  return (
    <>
      <ListSubheader>
        {getLang('LOCATION_SUBHEADING_SUMMARY')}
      </ListSubheader>
      {summaryItems.map(summary => (
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

export default SedaLocationSummary
