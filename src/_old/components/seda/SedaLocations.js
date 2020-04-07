import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { LocationStack } from '../organisms/LocationPanel'
import { getSelectedColors } from '../../shared/selectors'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  onRemoveSelectedFeature,
  onViewportChange,
  updateMapSize,
  setActiveLocation,
  onHoverFeature
} from '../../actions'
import {
  parseLocationsString,
  getLocationFromFeature
} from '../../modules/router'
import * as _debounce from 'lodash.debounce'

const SELECTED_COLORS = getSelectedColors()

/**
 * Returns the name followed by the state for the location
 */
const getLocationNameFromFeature = ({ properties: { name, state } }) =>
  name && state ? [name, state].join(', ') : 'Unknown'

/**
 * Returns the color associated with the given index
 * @param {*} index
 */
const getLocationColor = index =>
  SELECTED_COLORS[index % SELECTED_COLORS.length]

/**
 * Returns card objects for given selected state,
 * feature state, and route params
 */
const getCards = (selected, features) =>
  selected
    .map(id => features[id])
    .map((f, i) => ({
      id: f.properties.id,
      title: getLocationNameFromFeature(f),
      color: getLocationColor(i),
      feature: f
    }))

const SedaLocations = ({
  selected,
  features,
  activeId,
  shift,
  metric,
  secondary,
  demographic,
  onCardDismiss,
  onCardHover,
  onCardClick,
  onCardEntered,
  onCardExited
}) => {
  const cards = useMemo(() => getCards(selected, features), [
    selected,
    features
  ])
  return cards && cards.length ? (
    <LocationStack
      {...{
        activeId,
        cards,
        onCardDismiss,
        onCardHover,
        onCardClick,
        onCardEntered,
        onCardExited,
        metrics: [metric, secondary],
        demographic,
        classes: {
          root: shift ? 'summary-group--shift' : ''
        }
      }}
    />
  ) : null
}

SedaLocations.propTypes = {
  metric: PropTypes.string,
  secondary: PropTypes.string,
  demographic: PropTypes.string,
  selected: PropTypes.array,
  features: PropTypes.object,
  activeId: PropTypes.string,
  shift: PropTypes.bool,
  onCardDismiss: PropTypes.func,
  onCardClick: PropTypes.func,
  onCardHover: PropTypes.func,
  onCardExited: PropTypes.func,
  onCardEntered: PropTypes.func
}

const mapStateToProps = (
  { selected, features, active, ui: { helpOpen } },
  {
    match: {
      params: { region, demographic, metric, secondary }
    }
  }
) => ({
  activeId: active && active.properties ? active.properties.id : null,
  selected: selected[region],
  features,
  region,
  demographic,
  metric,
  secondary,
  shift: helpOpen || Boolean(active)
})

const mapDispatchToProps = dispatch => ({
  onCardDismiss: ({ feature }) => dispatch(onRemoveSelectedFeature(feature)),
  onCardHover: ({ feature }) => {
    dispatch(onHoverFeature(feature, { x: 0, y: 0 }))
  },
  onCardClick: ({ feature }) => {
    const l = parseLocationsString(getLocationFromFeature(feature))[0]
    if (l) {
      dispatch(setActiveLocation(feature, 'pinned'))
      dispatch(
        onViewportChange(
          {
            latitude: parseFloat(l.lat),
            longitude: parseFloat(l.lon),
            zoom: l.id.length + 2
          },
          true
        )
      )
    }
  },
  onCardEntered: _debounce(() => dispatch(updateMapSize()), 200),
  onCardExited: _debounce(() => dispatch(updateMapSize()), 200)
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SedaLocations)
