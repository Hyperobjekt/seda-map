import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Tooltip from '../atoms/Tooltip'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { LocationStatSummaryList } from '../organisms/LocationPanel/LocationStats'
import {
  getLang,
  getDescriptionForVarName
} from '../../shared/selectors/lang'
import {
  getDemographicIdFromVarName,
  getMetricIdFromVarName,
  isVersusFromVarNames,
  getDemographicForVarNames,
  isGapVarName,
  getFeatureProperty
} from '../../shared/selectors'
import { getStateName } from '../../shared/selectors/states'
import { Typography } from '@material-ui/core'

const getShortVarNameLabel = varName => {
  return getLang(
    'LABEL_SHORT_' + getMetricIdFromVarName(varName)
  )
}

const getShortVarNameGapLabel = varName => {
  return getLang(
    'LABEL_SHORT_' + getMetricIdFromVarName(varName) + '_GAP'
  )
}

const getDemographicLabel = varName => {
  const dem = getDemographicIdFromVarName(varName)
  return getLang('LABEL_' + dem)
}

const getContextLangKey = (isVersus, yVar) => {
  const metric = getMetricIdFromVarName(yVar)
  const demographic = getDemographicIdFromVarName(yVar)
  return isVersus
    ? 'TOOLTIP_CONTEXT_' + metric
    : 'TOOLTIP_CONTEXT_' + demographic
}

const ConnectedTooltip = ({
  feature,
  x,
  y,
  above,
  left,
  yVar,
  xVar
}) => {
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const isGap = isGapVarName(yVar)
  const demographic = getDemographicForVarNames(xVar, yVar)
  const descriptionVars = useMemo(() => {
    return isVersus
      ? [demographic + '_' + xVar.split('_')[1]]
      : [yVar, xVar]
  }, [xVar, yVar, demographic, isVersus])
  if (!feature || !feature.properties) {
    return null
  }
  const featureId = getFeatureProperty(feature, 'id')
  const title = getFeatureProperty(feature, 'name')
  const stateName = getStateName(featureId)
  const statVars = [yVar, xVar]

  // add var to feature if missing
  if (
    isVersus &&
    !getFeatureProperty(feature, descriptionVars[0])
  ) {
    feature.properties[descriptionVars[0]] =
      getFeatureProperty(feature, yVar) -
      getFeatureProperty(feature, xVar)
  }
  const description = descriptionVars.reduce((desc, varName) => {
    const val = getFeatureProperty(feature, varName)
    return val || val === 0
      ? desc + getDescriptionForVarName(varName, val) + ' '
      : desc
  }, '')
  const langContextKey = getContextLangKey(isVersus, yVar)

  return (
    <div className="tooltip__wrapper">
      {featureId && (
        <Tooltip
          title={title}
          subtitle={stateName}
          x={x}
          y={y}
          above={above}
          left={left}>
          <Typography
            variant="caption"
            className="tooltip__demographic">
            {getLang(langContextKey)}
          </Typography>
          <LocationStatSummaryList
            feature={feature}
            varNames={statVars}
            size="small"
            showDescription={false}
            varNameToLabel={
              isVersus
                ? getDemographicLabel
                : isGap
                ? getShortVarNameGapLabel
                : getShortVarNameLabel
            }
          />
          <Typography
            className="tooltip__description"
            variant="caption"
            dangerouslySetInnerHTML={{
              __html:
                description +
                '<em>' +
                getLang('TOOLTIP_SUMMARY') +
                '</em>'
            }}
          />
        </Tooltip>
      )}
    </div>
  )
}

ConnectedTooltip.propTypes = {
  feature: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  above: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  yVar: PropTypes.string,
  xVar: PropTypes.string
}

const mapStateToProps = ({
  map: {
    coords: { x, y }
  },
  sections: { hovered },
  tooltip
}) => {
  return {
    x,
    y,
    xVar: tooltip.xVar,
    yVar: tooltip.yVar,
    feature: hovered,
    above:
      window &&
      window.innerHeight &&
      y &&
      y > window.innerHeight / 3,
    left:
      window &&
      window.innerWidth &&
      x &&
      x > window.innerWidth / 2
  }
}

const SedaTooltip = compose(
  withRouter,
  connect(
    mapStateToProps,
    null
  )
)(ConnectedTooltip)

export default SedaTooltip
