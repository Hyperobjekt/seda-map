import React, { useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import LocationPanel from '../organisms/LocationPanel'
import {
  onReportDownload,
  clearActiveLocation,
  setDemographicAndMetric,
  loadLocation,
  handleLocationActivation,
  toggleHelp,
  showSingleHelpTopic,
  onShowSimilarAction
} from '../../actions'
import {
  getRegionFromFeature,
  getFeatureProperty
} from '../../shared/selectors'

const getFeatureFlags = (feature, flagged) => {
  const featureId = getFeatureProperty(feature, 'id')
  const region = getRegionFromFeature(feature)
  if (region !== 'schools') {
    return []
  }
  return ['sped', 'gifted', 'lep'].filter(f => {
    return flagged[f].indexOf(featureId) > -1
  })
}

const SedaLocationPanel = ({
  active,
  metric,
  helpOpen,
  features,
  selected,
  flagged,
  reportLoading,
  reportError,
  clearActiveLocation,
  onGapClick,
  onShowSimilar,
  onHelpClick,
  onSelectFeature,
  onDownloadReport
}) => {
  // use memo to store other features
  const others = useMemo(() => selected.map(fId => features[fId]), [
    selected,
    features
  ])
  const flags = useMemo(() => getFeatureFlags(active, flagged), [
    active,
    flagged
  ])
  const handleHelpClick = useMemo(
    () => topicId => onHelpClick(topicId, helpOpen),
    // eslint-disable-next-line
    [helpOpen]
  )
  return (
    <LocationPanel
      feature={active}
      others={others}
      flags={flags}
      onClose={clearActiveLocation}
      metric={metric}
      reportLoading={reportLoading}
      reportError={reportError}
      onGapClick={onGapClick}
      onHelpClick={handleHelpClick}
      onSelectFeature={onSelectFeature}
      onShowSimilar={onShowSimilar}
      onDownloadReport={onDownloadReport}
    />
  )
}

SedaLocationPanel.propTypes = {
  active: PropTypes.object,
  metric: PropTypes.string,
  features: PropTypes.object,
  region: PropTypes.string,
  selected: PropTypes.array,
  clearActiveLocation: PropTypes.func,
  onGapClick: PropTypes.func,
  onHelpClick: PropTypes.func,
  onSelectFeature: PropTypes.func,
  onShowSimilar: PropTypes.func,
  onDownloadReport: PropTypes.func,
  helpOpen: PropTypes.bool
}

const mapStateToProps = (
  {
    features,
    active,
    selected,
    ui: { helpOpen, reportLoading, reportError },
    flagged
  },
  {
    match: {
      params: { metric, region }
    }
  }
) => ({
  active,
  features,
  flagged,
  region,
  metric,
  helpOpen,
  reportLoading,
  reportError,
  selected: selected[region]
})

const mapDispatchToProps = dispatch => ({
  onGapClick: (gapId, metricId) => {
    dispatch(setDemographicAndMetric(gapId, metricId))
    // close panel if mobile
    if (window.innerWidth < 650) {
      dispatch(clearActiveLocation())
    }
  },
  clearActiveLocation: () => dispatch(clearActiveLocation()),
  onSelectFeature: feature => {
    // feature is a stub, need to load full data
    if (feature.stub) {
      dispatch(loadLocation(feature.properties, 'panel'))
    } else {
      dispatch(handleLocationActivation(feature, 'panel'))
    }
  },
  onShowSimilar: feature => {
    dispatch(onShowSimilarAction(feature))
  },
  onHelpClick: (topicId, helpOpen) => {
    !helpOpen && dispatch(toggleHelp())
    dispatch(showSingleHelpTopic(topicId))
  },
  onDownloadReport: feature => {
    dispatch(onReportDownload(feature))
  }
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SedaLocationPanel)
