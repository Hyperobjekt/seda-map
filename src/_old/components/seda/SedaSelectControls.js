import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { getStateSelectOptions } from '../../shared/selectors/states'
import {
  getSingularRegions,
  getDemographics,
  getGaps,
  getMetricById,
  isGapDemographic
} from '../../shared/selectors'
import InlineMenu from '../atoms/InlineMenu'
import {
  onRegionChange,
  onDemographicChange,
  onHighlightedStateChange
} from '../../actions'

export const GapTypeInlineMenu = ({ metric, onChange }) => {
  const options = [
    getMetricById('ses'),
    getMetricById('seg'),
    getMetricById('min')
  ]
  return (
    <InlineMenu
      id="gapType"
      label="Gap Type"
      value={metric}
      options={options}
      onChange={onChange}
    />
  )
}
GapTypeInlineMenu.propTypes = {
  metric: PropTypes.string,
  onChange: PropTypes.func
}

export const RegionInlineMenu = ({
  region,
  onChange,
  ...rest
}) => {
  return (
    <InlineMenu
      id="region"
      value={region}
      options={getSingularRegions()}
      onChange={onChange}
      {...rest}
    />
  )
}
RegionInlineMenu.propTypes = {
  region: PropTypes.string,
  onChange: PropTypes.func
}

export const RegionControl = compose(
  withRouter,
  connect(
    (
      s,
      {
        match: {
          params: { region = 'counties' }
        }
      }
    ) => ({
      region
    }),
    (dispatch, ownProps) => ({
      onChange: id => {
        dispatch(onRegionChange(id, ownProps))
      }
    })
  )
)(RegionInlineMenu)

const formatDemographic = option => {
  const isGap = isGapDemographic(option.id)
  if (isGap) {
    return option.label
  }
  return (
    option.label +
    (option.id.length === 1 ||
    option.id === 'all' ||
    option.id === 'np'
      ? ' students'
      : '')
  )
}

export const DemographicAndGapMenu = ({
  demographic,
  onChange,
  ...rest
}) => {
  return (
    <InlineMenu
      id="demographic"
      value={demographic}
      options={[...getDemographics(), ...getGaps()]}
      formatter={formatDemographic}
      onChange={onChange}
      {...rest}
    />
  )
}
DemographicAndGapMenu.propTypes = {
  demographic: PropTypes.string,
  onChange: PropTypes.func
}

export const DemographicAndGapControl = compose(
  withRouter,
  connect(
    (
      s,
      {
        match: {
          params: { demographic = 'all' }
        }
      }
    ) => ({
      demographic
    }),
    (dispatch, ownProps) => ({
      onChange: id => dispatch(onDemographicChange(id, ownProps))
    })
  )
)(DemographicAndGapMenu)

export const HighlightedStateMenu = ({
  highlightedState,
  onChange,
  ...rest
}) => {
  return (
    <InlineMenu
      id="highlight"
      value={highlightedState}
      options={[
        {
          id: 'us',
          label: 'U.S.'
        },
        ...getStateSelectOptions()
      ]}
      onChange={onChange}
      {...rest}
    />
  )
}
HighlightedStateMenu.propTypes = {
  highlightedState: PropTypes.string,
  onChange: PropTypes.func
}

export const HighlightedStateControl = compose(
  withRouter,
  connect(
    (
      s,
      {
        match: {
          params: { highlightedState = 'us' }
        }
      }
    ) => ({
      highlightedState
    }),
    (dispatch, ownProps) => ({
      onChange: id =>
        dispatch(onHighlightedStateChange(id, ownProps))
    })
  )
)(HighlightedStateMenu)
