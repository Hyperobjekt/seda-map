import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  getFeatureProperty,
  getPositionForVarNameValue,
  getRegionFromFeatureId,
  getColorForVarNameValue,
  getMetricIdFromVarName,
  getMetricRangeFromVarName,
  getFormatterForVarName,
  isGapVarName
} from '../../../shared/selectors'
import {
  getLang,
  getDescriptionForVarName
} from '../../../shared/selectors/lang'

import StatSummary from './StatSummary'

import {
  getPositionFromValue,
  stripHtml,
  getValuePositionInRange
} from '../../../shared/utils'
import StatDiverging from '../../molecules/StatDiverging'

const getMetricValueToPosition = metricId => {
  return metricId === 'grd'
    ? v => (v && v > 1 ? 'up' : v && v < 1 ? 'down' : null)
    : v => (v > 0 ? 'up' : v < 0 ? 'down' : null)
}

export const LocationStatSummary = ({ feature, varName }) => {
  const region = getRegionFromFeatureId(feature.properties.id)
  const metricId = getMetricIdFromVarName(varName)
  const value = getFeatureProperty(feature, varName)
  const color = getColorForVarNameValue(value, varName, region)
  const label = getLang('LABEL_' + metricId)
  const formatter = getFormatterForVarName(varName)
  const valueToPosition = getMetricValueToPosition(metricId)
  const description = getDescriptionForVarName(
    varName,
    value,
    formatter
  )

  return (
    <StatSummary
      {...{
        label,
        value,
        description,
        color,
        formatter,
        valueToPosition
      }}
    />
  )
}

LocationStatSummary.propTypes = {
  feature: PropTypes.object,
  varName: PropTypes.string
}

export const LocationStatDiverging = ({
  feature,
  otherFeature,
  markerColor,
  label,
  varName,
  range,
  formatter,
  showDescription = false,
  showLabels = false,
  ...rest
}) => {
  const region = getRegionFromFeatureId(feature.properties.id)
  const metricId = getMetricIdFromVarName(varName)
  const isGap = isGapVarName(varName)
  const value = getFeatureProperty(feature, varName)
  range =
    range || getMetricRangeFromVarName(varName, region, 'map')
  formatter = formatter || getFormatterForVarName(varName)
  const color = getColorForVarNameValue(value, varName, region)
  const position = getPositionForVarNameValue(
    varName,
    value,
    range
  )
  const midPoint = metricId === 'grd' && !isGap ? 1 : 0
  const midPosition =
    getValuePositionInRange(midPoint, range) * 100 + '%'

  // get min / max labels if showing
  const labels = showLabels
    ? {
        minLabel: formatter(range[0]),
        maxLabel: formatter(range[1])
      }
    : {}

  // get description if showing
  const description = getDescriptionForVarName(
    varName,
    value,
    formatter
  )

  // get position for other feature marker
  const otherValue = getFeatureProperty(otherFeature, varName)
  const otherPosition = getPositionFromValue(
    otherValue,
    range,
    midPoint
  )
  return (
    <StatDiverging
      label={label}
      value={value}
      position={position}
      markerPosition={otherPosition}
      markerColor={markerColor}
      formatter={formatter}
      color={color}
      showDescription={showDescription}
      description={
        showDescription ? description : stripHtml(description)
      }
      midPoint={midPoint}
      midPosition={midPosition}
      full={metricId === 'frl'}
      {...labels}
      {...rest}
    />
  )
}

LocationStatDiverging.propTypes = {
  feature: PropTypes.object,
  varName: PropTypes.string,
  label: PropTypes.string,
  range: PropTypes.array,
  formatter: PropTypes.func,
  showDescription: PropTypes.bool,
  otherFeature: PropTypes.object,
  markerColor: PropTypes.string,
  showLabels: PropTypes.bool
}

const getVarNameLabel = varName => {
  return getLang('LABEL_' + getMetricIdFromVarName(varName))
}

export const LocationStatList = ({
  feature,
  type = 'diverging',
  varNames = ['all_avg', 'all_grd', 'all_coh', 'all_ses'],
  varNameToLabel = getVarNameLabel,
  className,
  ...rest
}) => {
  if (!feature || !feature.properties) {
    return null
  }
  const StatElement =
    type === 'diverging'
      ? LocationStatDiverging
      : LocationStatSummary
  return (
    <div
      className={classNames(
        'stat-list',
        {
          'stat-list--diverging': type === 'diverging',
          'stat-list--arrow': type === 'arrow'
        },
        className
      )}>
      {varNames.map(varName => (
        <StatElement
          key={varName}
          feature={feature}
          varName={varName}
          label={varNameToLabel(varName)}
          {...rest}
        />
      ))}
    </div>
  )
}

LocationStatList.propTypes = {
  feature: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.oneOf(['diverging', 'arrow']),
  varNames: PropTypes.array,
  range: PropTypes.array,
  varNameToLabel: PropTypes.func
}

export const LocationStatSummaryList = props => {
  return (
    <LocationStatList
      showLabels={true}
      showDescription={true}
      {...props}
    />
  )
}
