import React from 'react'
import {
  getTooltipMetricLang,
  getMetricLabel,
  getDemographicLabel,
  getLang
} from '../app/selectors/lang'
import {
  isVersusFromVarNames,
  getDemographicForVarNames,
  getRegionFromLocationId,
  getSingularRegion,
  isUnavailable
} from '../app/selectors'
import { Typography, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { Tooltip } from '../../../shared'
import { useHovered, useRegion } from '../app/hooks'
import { useScatterplotVars } from '../scatterplot'
import useTooltipVisibility from './hooks/useTooltipVisibility'
import useTooltipCoords from './hooks/useTooltipCoords'
import { useLocationData } from '../location'
import SedaStat from '../stats/SedaStat'

const useStatStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75)
  },
  label: {
    minWidth: theme.spacing(19),
    marginRight: theme.spacing(2)
  },
  value: {
    marginTop: 4,
    minWidth: theme.spacing(10)
  },
  primary: {
    // height: theme.typography.pxToRem(theme.spacing(2.5)),
    lineHeight: theme.typography.pxToRem(theme.spacing(2.5)),
    textTransform: 'capitalize',
    justifyContent: 'flex-end'
  },
  secondary: {
    display: 'block',
    // height: theme.typography.pxToRem(theme.spacing(2)),
    lineHeight: theme.typography.pxToRem(theme.spacing(2)),
    color: theme.app.altDarkText
  },
  secondaryStat: {
    maxWidth: theme.spacing(11),
    textAlign: 'right'
  },
  unavailable: {
    textAlign: 'right'
  }
}))

const StatDetailed = ({ varName, value }) => {
  const classes = useStatStyles()
  const isNA = isUnavailable(value)
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
        <SedaStat
          className={classes.primary}
          value={value}
          varName={varName}
          dark={true}
        />
        {!isNA && (
          <Typography
            style={{ marginLeft: 4 }}
            className={clsx(
              classes.secondary,
              classes.secondaryStat
            )}
            variant="caption">
            {getTooltipMetricLang(varName, value)}
          </Typography>
        )}
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

  // add var to feature if missing
  if (isVersus && data && !data[descriptionVars[0]]) {
    data[descriptionVars[0]] = data[yVar] - data[xVar]
  }
  const bounds = [
    0,
    0,
    window.innerWidth,
    window.innerHeight - 80
  ]
  const classes = useStyles()

  return data ? (
    <Tooltip
      title={data.name}
      subtitle={data.parentLocation}
      show={showTooltip}
      x={x}
      y={y}
      bounds={bounds}
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
