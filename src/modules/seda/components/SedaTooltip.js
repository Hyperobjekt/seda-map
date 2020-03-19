import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  getTooltipMetricLang,
  getMetricLabel,
  getDemographicLabel,
  getLang
} from '../../../shared/selectors/lang'
import {
  isVersusFromVarNames,
  getDemographicForVarNames,
  getMidpointForVarName,
  getFormatterForVarName,
  getRegionFromFeatureId,
  getSingularRegion
} from '../../../shared/selectors'
import { getStateName } from '../../../shared/selectors/states'
import { Typography, makeStyles } from '@material-ui/core'
import useUiStore from '../hooks/useUiStore'
import clsx from 'clsx'
import Tooltip from '../../../base/components/Tooltip'
import debug from 'debug'
import useDataOptions from '../hooks/useDataOptions'
import MetricValue from '../../../base/components/MetricValue'

const useStatStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75)
  },
  label: {
    minWidth: theme.spacing(19)
  },
  value: {},
  primary: {
    height: theme.typography.pxToRem(theme.spacing(2.5)),
    lineHeight: theme.typography.pxToRem(theme.spacing(2.5)),
    textTransform: 'capitalize'
  },
  secondary: {
    display: 'block',
    height: theme.typography.pxToRem(theme.spacing(2)),
    lineHeight: theme.typography.pxToRem(theme.spacing(2)),
    color: theme.app.altDarkText
  }
}))

const StatDetailed = ({ varName, value }) => {
  const classes = useStatStyles()
  return (
    <div className={clsx('stat-detailed', classes.root)}>
      <div
        className={clsx('stat-detailed__label', classes.label)}>
        <Typography className={classes.primary} variant="body1">
          {getMetricLabel(varName)}
        </Typography>
        <Typography
          className={classes.secondary}
          variant="caption">
          {getDemographicLabel(varName, 'TOOLTIP_CONTEXT')}
        </Typography>
      </div>
      <div
        className={clsx('stat-detailed__value', classes.value)}>
        <MetricValue
          className={classes.primary}
          value={value}
          formatter={getFormatterForVarName(varName)}
          mid={getMidpointForVarName(varName)}
          dark={true}
        />
        <Typography
          style={{ marginLeft: 4 }}
          className={classes.secondary}
          variant="caption">
          {getTooltipMetricLang(varName, value)}
        </Typography>
      </div>
    </div>
  )
}

debug.enable('Tooltip')
const log = debug('Tooltip')

const useStyles = makeStyles(theme => ({
  hint: {
    display: 'block',
    marginTop: theme.spacing(1),
    padding: `${theme.spacing(1.5)}px 0 ${theme.spacing(0.5)}px`,
    fontStyle: 'italic',
    lineHeight: 1,
    borderTop: '1px dotted rgba(255,255,255,0.34)',
    color: theme.app.altDarkText
  }
}))

const SedaTooltip = props => {
  const hoveredId = useUiStore(state => state.hovered)
  const showTooltip = useUiStore(state => state.showTooltip)
  const region = getRegionFromFeatureId(hoveredId)
  const [x, y] = useUiStore(state => state.coords)
  const { xVar, yVar } = useDataOptions(state =>
    state.getScatterplotVars()
  )
  const data = useDataOptions(state =>
    state.getDataForId(hoveredId)
  )

  const isVersus = isVersusFromVarNames(xVar, yVar)
  const demographic = getDemographicForVarNames(xVar, yVar)
  const descriptionVars = isVersus
    ? [demographic + '_' + xVar.split('_')[1]]
    : [yVar, xVar]
  const stateName = data.id ? getStateName(data.id) : ''

  // add var to feature if missing
  if (isVersus && !data[descriptionVars[0]]) {
    data[descriptionVars[0]] = data[yVar] - data[xVar]
  }

  const classes = useStyles()

  return (
    <Tooltip
      title={data.name}
      subtitle={stateName}
      show={showTooltip}
      x={x}
      y={y}>
      <StatDetailed varName={yVar} value={data[yVar]} />
      <StatDetailed varName={xVar} value={data[xVar]} />
      <Typography className={classes.hint} variant="caption">
        {getLang('TOOLTIP_HINT', {
          region: getSingularRegion(region)
        })}
      </Typography>
    </Tooltip>
  )
}

SedaTooltip.propTypes = {}

export default SedaTooltip
