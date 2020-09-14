import React from 'react'
import {
  getTooltipMetricLang,
  getMetricLabel,
  getDemographicLabel,
  getLang
} from '../selectors/lang'
import {
  isVersusFromVarNames,
  getDemographicForVarNames,
  getMidpointForVarName,
  getFormatterForVarName,
  getRegionFromLocationId,
  getSingularRegion
} from '../selectors'
import { getStateName } from '../../../shared/utils/states'
import { Typography, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { Tooltip, DivergingStatValue } from '../../../shared'
import {
  useLocationData,
  useScatterplotVars,
  useTooltipCoords,
  useTooltipVisibility,
  useHovered,
  useRegion
} from '../hooks'

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
        <DivergingStatValue
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

const useStyles = makeStyles(theme => ({
  hint: theme.mixins.hint
}))

const getSecondaryVar = (activeRegion, featureRegion) =>
  featureRegion === 'schools' ? 'all_frl' : 'all_ses'

const SedaTooltip = props => {
  const [hoveredId] = useHovered()
  const [showTooltip] = useTooltipVisibility()
  const [[x, y]] = useTooltipCoords()
  const [xVar, yVar] = useScatterplotVars()
  const [region] = useRegion()
  const data = useLocationData(hoveredId)
  const featureRegion = getRegionFromLocationId(hoveredId)
  // force free lunch secondary metric for schools
  const secondaryVar =
    region === featureRegion
      ? xVar
      : getSecondaryVar(region, featureRegion)
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const demographic = getDemographicForVarNames(xVar, yVar)
  const descriptionVars = isVersus
    ? [demographic + '_' + xVar.split('_')[1]]
    : [yVar, xVar]
  const stateName = data && data.id ? getStateName(data.id) : ''

  // add var to feature if missing
  if (isVersus && data && !data[descriptionVars[0]]) {
    data[descriptionVars[0]] = data[yVar] - data[xVar]
  }

  const classes = useStyles()

  return data ? (
    <Tooltip
      title={data.name}
      subtitle={stateName}
      show={showTooltip}
      x={x}
      y={y}
      {...props}>
      <StatDetailed varName={yVar} value={data[yVar]} />
      <StatDetailed
        varName={secondaryVar}
        value={data[secondaryVar]}
      />
      <Typography className={classes.hint} variant="caption">
        {getLang('TOOLTIP_HINT', {
          region: getSingularRegion(region)
        })}
      </Typography>
    </Tooltip>
  ) : null
}

export default SedaTooltip
