import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import LocationItem from './LocationItem'
import {
  getFeatureProperty,
  getRegionFromLocationId,
  getMetricRange
} from '../../../shared/selectors'
import { getLang } from '../../../shared/selectors/lang'
import { LocationStatDiverging } from './LocationStats'
import { formatNumber } from '../../../shared/utils'
import { ButtonBase } from '@material-ui/core'

const statToLabel = s =>
  getLang('LABEL_SHORT_' + s.split('_')[1])

const LocationComparisonItem = ({
  idx,
  feature,
  otherFeature,
  demographic,
  region,
  metrics,
  markerColor,
  onSelectFeature
}) => {
  const name = getFeatureProperty(feature, 'name')
  return (
    <LocationItem idx={idx} feature={feature}>
      {metrics.map(m => {
        const range = getMetricRange(
          m,
          demographic,
          region,
          'map'
        ) || [-1, 1]
        return (
          <LocationStatDiverging
            key={m}
            feature={feature}
            otherFeature={otherFeature}
            markerColor={markerColor}
            range={range}
            varName={demographic + '_' + m}
            label={statToLabel(demographic + '_' + m)}
            minLabel={formatNumber(range[0])}
            maxLabel={formatNumber(range[1])}
          />
        )
      })}
      <ButtonBase
        className="button button--link"
        disableRipple={true}
        onClick={() => onSelectFeature(feature)}>
        {getLang('LOCATION_SHOW_PLACE', { name })}
      </ButtonBase>
      <hr />
    </LocationItem>
  )
}

LocationComparisonItem.propTypes = {
  idx: PropTypes.number,
  feature: PropTypes.object,
  otherFeature: PropTypes.object,
  demographic: PropTypes.string,
  region: PropTypes.string,
  metrics: PropTypes.array,
  markerColor: PropTypes.string,
  onSelectFeature: PropTypes.func
}

const LocationList = ({
  metrics = ['avg', 'grd', 'coh'],
  demographic = 'all',
  feature,
  className,
  others = [],
  markerColor,
  showMarkers = true,
  onSelectFeature
}) => {
  if (!feature || !feature.properties) {
    return null
  }
  const region = getRegionFromLocationId(feature.properties.id)
  return (
    <div className={classNames('location-list', className)}>
      {others.map((f, i) => {
        return f && f.properties
          ? f.properties.id !== feature.properties.id && (
              <LocationComparisonItem
                key={'l' + i}
                idx={showMarkers ? i : null}
                feature={f}
                otherFeature={feature}
                markerColor={markerColor}
                demographic={demographic}
                region={region}
                metrics={metrics}
                onSelectFeature={onSelectFeature}
              />
            )
          : null
      })}
    </div>
  )
}

LocationList.propTypes = {
  summary: PropTypes.string,
  demographic: PropTypes.string,
  feature: PropTypes.object,
  others: PropTypes.array,
  metrics: PropTypes.array,
  className: PropTypes.string,
  onSelectFeature: PropTypes.func,
  markerColor: PropTypes.string,
  showMarkers: PropTypes.bool
}

export default LocationList
