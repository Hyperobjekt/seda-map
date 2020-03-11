import React from 'react'
import PropTypes from 'prop-types'
import Marker from '../../atoms/BaseMarker'
import { getSelectedColors } from '../../../shared/selectors'
import { IconButton } from '@material-ui/core'
import { getStateName } from '../../../shared/selectors/states'

const SELECTED = getSelectedColors()

const LocationItem = ({
  idx,
  label,
  feature,
  children,
  actionIcon,
  onActionPress,
  onHover,
  ...props
}) => {
  const stateName = getStateName(
    feature.properties.id.substring(0, 2)
  )
  return (
    <div
      onMouseEnter={onHover}
      className="location-item"
      {...props}>
      {(label || idx || idx === 0) && (
        <Marker
          aria-label={'Location number ' + (parseInt(idx) + 1)}
          className="location-item__marker"
          color={SELECTED[idx]}
          type="circle">
          {label ? label : idx + 1}
        </Marker>
      )}
      <div className="location-item__content-wrapper">
        <div className="location-item__heading">
          <span className="location-item__name">
            {feature.properties.name}
          </span>
          <span className="location-item__state">
            {stateName}
          </span>
        </div>
        <div className="location-item__content">{children}</div>
      </div>
      {actionIcon && onActionPress && (
        <IconButton
          size="small"
          className="location-item__action"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onActionPress(feature)
            return false
          }}>
          {actionIcon}
        </IconButton>
      )}
    </div>
  )
}

LocationItem.propTypes = {
  feature: PropTypes.object,
  idx: PropTypes.number,
  label: PropTypes.string,
  children: PropTypes.node,
  actionIcon: PropTypes.node,
  onActionPress: PropTypes.func
}

export default LocationItem
