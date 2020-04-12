import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Button } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Callout from '../../molecules/Callout'
import HelpIcon from '@material-ui/icons/Help'

import {
  formatNumber,
  formatPercentDiff
} from '../../../shared/utils'
import { getLang } from '../../../shared/selectors/lang'
import { LocationStatList } from './LocationStats'
import {
  getFeatureProperty,
  getMetricRange,
  getRegionFromLocationId,
  getPredictedValue,
  valueToLowMidHigh
} from '../../../shared/selectors'

const PanelButton = ({ langKey, ...rest }) => {
  return (
    <Button className="button--panel" fullWidth={true} {...rest}>
      {getLang(langKey)}
      <ChevronRightIcon />
    </Button>
  )
}

const LocationMetric = ({
  feature,
  metric,
  children,
  formatter,
  onGapClick,
  ...rest
}) => {
  if (!feature) {
    return null
  }
  const region = getRegionFromLocationId(feature.properties.id)
  const range = getMetricRange(metric, 'all', region, 'map')
  const statToLabel = s => getLang('LABEL_' + s.split('_')[0])
  return (
    <div
      id={'metric_' + metric}
      className="panel-section__metric-details"
      {...rest}>
      {children}
      {region !== 'schools' && (
        <>
          <Typography
            className={'panel-section__subheading'}
            variant="h6">
            {getLang('LABEL_BY_SUBGROUP', {
              metric: getLang('LABEL_' + metric)
            })}
          </Typography>
          <LocationStatList
            feature={feature}
            varNames={[
              'w',
              'b',
              'h',
              'a',
              'np',
              'p',
              'm',
              'f'
            ].map(d => d + '_' + metric)}
            range={range}
            formatter={formatter}
            varNameToLabel={statToLabel}
          />
          <PanelButton
            langKey="BUTTON_GAP_WB"
            onClick={() => onGapClick('wb', metric)}
          />
          <PanelButton
            langKey="BUTTON_GAP_WH"
            onClick={() => onGapClick('wh', metric)}
          />
          <PanelButton
            langKey="BUTTON_GAP_PN"
            onClick={() => onGapClick('pn', metric)}
          />
          <PanelButton
            langKey="BUTTON_GAP_MF"
            onClick={() => onGapClick('mf', metric)}
          />
        </>
      )}
    </div>
  )
}

LocationMetric.propTypes = {
  feature: PropTypes.object.isRequired,
  metric: PropTypes.string.isRequired,
  children: PropTypes.node,
  formatter: PropTypes.func,
  onGapClick: PropTypes.func
}

const MetricSummary = ({
  metric,
  formatter = formatNumber,
  name,
  value,
  region
}) => {
  const langKey =
    region === 'schools'
      ? 'SUMMARY_SCHOOL_' +
        metric +
        '_' +
        valueToLowMidHigh(metric, value)
      : 'SUMMARY_' +
        metric +
        '_' +
        valueToLowMidHigh(metric, value)
  return (
    // eslint-disable-next-line
    <Typography
      role="text"
      variant="body1"
      paragraph={true}
      dangerouslySetInnerHTML={{
        __html: getLang(langKey, {
          name,
          value: formatter(value)
        })
      }}
    />
  )
}

MetricSummary.propTypes = {
  metric: PropTypes.string,
  formatter: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.number,
  region: PropTypes.string
}

export const LocationAvgSection = ({
  feature,
  onHelpClick,
  ...rest
}) => {
  if (!feature) {
    return null
  }
  const name = getFeatureProperty(feature, 'name')
  const region = getRegionFromLocationId(
    getFeatureProperty(feature, 'id')
  )

  const avgValue = getFeatureProperty(feature, 'all_avg')
  const sesValue =
    region === 'schools'
      ? getFeatureProperty(feature, 'all_frl')
      : getFeatureProperty(feature, 'all_ses')
  const diffVal =
    sesValue || sesValue === 0
      ? formatNumber(
          avgValue - getPredictedValue(sesValue, 'avg', region)
        )
      : null
  const diffHighLow = valueToLowMidHigh(null, diffVal)
  const sesLangKey =
    region === 'schools'
      ? 'SUMMARY_AVGFRL_' + diffHighLow
      : 'SUMMARY_AVGSES_' + diffHighLow
  return (
    <LocationMetric metric="avg" feature={feature} {...rest}>
      <MetricSummary
        metric="avg"
        name={name}
        value={avgValue}
        formatter={formatNumber}
        region={region}
      />
      <Typography
        variant="body1"
        paragraph={true}
        dangerouslySetInnerHTML={{
          __html: getLang(sesLangKey, {
            value: diffVal,
            name,
            region
          })
        }}
      />
      <Callout
        type="help"
        size="small"
        icon={<HelpIcon />}
        onClick={() => onHelpClick('HELP_AVG_CONCEPT')}>
        {getLang('CALLOUT_AVG_OPP')}
      </Callout>
    </LocationMetric>
  )
}

export const LocationGrdSection = ({
  feature,
  onHelpClick,
  ...rest
}) => {
  if (!feature) {
    return null
  }
  const name = getFeatureProperty(feature, 'name')
  const value = getFeatureProperty(feature, 'all_grd')
  const region = getRegionFromLocationId(
    getFeatureProperty(feature, 'id')
  )
  const sesValue =
    region === 'schools'
      ? getFeatureProperty(feature, 'all_frl')
      : getFeatureProperty(feature, 'all_ses')
  const diffVal =
    sesValue || sesValue === 0
      ? value - getPredictedValue(sesValue, 'grd', region)
      : null
  const diffHighLow = valueToLowMidHigh(null, diffVal)
  const sesLangKey =
    region === 'schools'
      ? 'SUMMARY_GRDFRL_' + diffHighLow
      : 'SUMMARY_GRDSES_' + diffHighLow
  return (
    <LocationMetric
      metric="grd"
      feature={feature}
      formatter={formatPercentDiff}
      {...rest}>
      <MetricSummary
        metric="grd"
        name={name}
        value={value}
        formatter={formatPercentDiff}
        region={region}
      />
      <Typography
        variant="body1"
        paragraph={true}
        dangerouslySetInnerHTML={{
          __html: getLang(sesLangKey, {
            value: formatPercentDiff(diffVal, { from: 0 }),
            name,
            region
          })
        }}
      />
      <Callout
        type="help"
        size="small"
        icon={<HelpIcon />}
        onClick={() => onHelpClick('HELP_GRD_CONCEPT')}>
        {getLang('CALLOUT_GRD')}
      </Callout>
    </LocationMetric>
  )
}

export const LocationCohSection = ({
  feature,
  onHelpClick,
  ...rest
}) => {
  if (!feature) {
    return null
  }
  const name = getFeatureProperty(feature, 'name')
  const value = getFeatureProperty(feature, 'all_coh')
  const region = getRegionFromLocationId(
    getFeatureProperty(feature, 'id')
  )

  const sesValue =
    region === 'schools'
      ? getFeatureProperty(feature, 'all_frl')
      : getFeatureProperty(feature, 'all_ses')
  const diffVal =
    sesValue || sesValue === 0
      ? formatNumber(
          value - getPredictedValue(sesValue, 'coh', region)
        )
      : null
  const diffHighLow = valueToLowMidHigh(null, diffVal)
  const sesLangKey =
    region === 'schools'
      ? 'SUMMARY_COHFRL_' + diffHighLow
      : 'SUMMARY_COHSES_' + diffHighLow
  return (
    <LocationMetric metric="coh" feature={feature} {...rest}>
      <MetricSummary
        metric="coh"
        region={region}
        name={name}
        value={value}
        formatter={formatNumber}
      />
      <Typography
        variant="body1"
        paragraph={true}
        dangerouslySetInnerHTML={{
          __html: getLang(sesLangKey, {
            value: diffVal,
            name,
            region
          })
        }}
      />
      <Callout
        type="help"
        size="small"
        icon={<HelpIcon />}
        onClick={() => onHelpClick('HELP_COH_CONCEPT')}>
        {getLang('CALLOUT_COH')}
      </Callout>
    </LocationMetric>
  )
}

const LocationMetricDetails = ({ metric, ...props }) => {
  switch (metric) {
    case 'avg':
      return <LocationAvgSection {...props} />
    case 'grd':
      return <LocationGrdSection {...props} />
    case 'coh':
      return <LocationCohSection {...props} />
    default:
      return null
  }
}

export default LocationMetricDetails
