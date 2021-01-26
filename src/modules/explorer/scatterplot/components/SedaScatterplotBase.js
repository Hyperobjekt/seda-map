import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { withStyles } from '@material-ui/core'

import ScatterplotBase, {
  ScatterplotAxis
} from '../../../scatterplot'
import { theme } from '../theme'
import {
  getLang,
  getLabelForVarName,
  getRegionLabel,
  getPrefixLang
} from '../../app/selectors/lang'
import SedaLocationMarkers from './SedaLocationMarkers'
import useStaticData from '../../../data/useStaticData'
import { getScatterplotOptions } from '../style'
import {
  getDemographicIdFromVarName,
  getMetricIdFromVarName,
  isGapVarName
} from '../../app/selectors'
import HintIconButton from '../../../../shared/components/Buttons/HintIconButton'

/** These define the minimum / maximum extents, so that the midpoint is always kept in view */
const MIN_EXTENTS = {
  grd: [0.9, 1.1],
  coh: [-0.05, 0.05],
  frl: [0, 1],
  grd_gap: [-0.1, 0.1],
  coh_gap: [-0.05, 0.05],
  min_gap: [-0.1, 0.1]
}

const adjustExtent = (varName, extent) => {
  // do not adjust size extents
  if (varName.indexOf('_sz')) return extent
  const isGap = isGapVarName(varName)
  const metric = getMetricIdFromVarName(varName)
  const key = isGap ? metric + '_gap' : metric
  const minExtent = MIN_EXTENTS[key] || [-0.5, 0.5]
  return [
    Math.min(minExtent[0], extent[0]),
    Math.max(minExtent[1], extent[1])
  ]
}

const styles = theme => ({
  root: {
    position: 'relative'
  },
  markers: {
    top: `var(--sp-top)`,
    right: 'var(--sp-right)',
    bottom: 'var(--sp-bottom)',
    left: 'var(--sp-left)'
  },
  axis: {
    position: 'absolute'
  },
  xAxis: {
    bottom: theme.spacing(-4),
    left: 0,
    right: 0,
    width: 'auto'
  },
  yAxis: {
    right: theme.spacing(-4),
    top: 0,
    bottom: 0,
    width: 0,
    // reposition y axis for smaller margins on mobile
    [theme.breakpoints.down('sm')]: {
      right: theme.spacing(-3)
    }
  },
  centerLabelX: {
    marginLeft: 'calc(0.5 * var(--sp-right))'
  },
  endLabels: {
    color: theme.palette.grey[600],
    fontSize: theme.typography.pxToRem(12)
  }
})

function SedaScatterplotBase({
  className,
  classes,
  variant,
  gapChart = false,
  axisChildren,
  children,
  onHover,
  onClick,
  onReady,
  allData,
  data,
  vars,
  extents,
  colorExtent,
  region,
  ...props
}) {
  // boolean indicating if data is loading
  const loading = useStaticData(state => state.isLoading)

  const [xVar, yVar, zVar] = vars

  const xLabel = gapChart
    ? getDemographicIdFromVarName(xVar)
    : xVar
  const xLabelPrefix = gapChart ? 'LABEL_GAP' : 'LABEL'
  const xMetric = getMetricIdFromVarName(xVar)
  // hint metrics that do no have explanation elsewhere
  const hasAxisHint =
    ['ses', 'seg', 'min', 'frl'].indexOf(xMetric) > -1

  // adjust extents so midpoint is always in view
  const adjustedExtents = useMemo(
    () =>
      extents.map((extent, i) => adjustExtent(vars[i], extent)),
    [extents, vars]
  )


  // memoize the scatterplot options
  const options = useMemo(() => {
    return getScatterplotOptions(variant, {
      allData, // entire region dataset, unfiltered
      data, // filtered data
      xVar,
      yVar,
      zVar,
      extents: adjustedExtents,
      colorExtent,
      region
    })
  }, [
    variant,
    allData,
    data,
    xVar,
    yVar,
    zVar,
    adjustedExtents,
    colorExtent,
    region
  ])

  return (
    <div
      role="img"
      aria-label={getLang('UI_CHART_SR', {
        region,
        xVar: getLabelForVarName(xVar),
        yVar: getLabelForVarName(yVar)
      })}
      className={clsx('scatterplot', classes.root, className)}
      {...props}>
      <ScatterplotBase
        theme={theme}
        loading={loading}
        options={options}
        classes={{ error: 'scatterplot__error' }}
        onHover={onHover}
        onClick={onClick}
        onReady={onReady}
      />
      {children}
      <SedaLocationMarkers
        className={clsx('scatterplot__markers', classes.markers)}
        vars={vars}
        extents={adjustedExtents}
        region={region}
        gapChart={gapChart}
      />
      <ScatterplotAxis
        className={clsx(
          'scatterplot__axis--x',
          classes.axis,
          classes.xAxis
        )}
        classes={{
          labelContainer: classes.endLabels,
          contentContainer: classes.centerLabelX
        }}
        showLabels={false}
        label={getPrefixLang(xLabel, xLabelPrefix)}>
        {axisChildren}
        {hasAxisHint && (
          <HintIconButton
            title={getPrefixLang(xMetric, 'HINT')}
          />
        )}
      </ScatterplotAxis>
      <ScatterplotAxis
        className={clsx(
          'scatterplot__axis--y',
          classes.axis,
          classes.yAxis
        )}
        classes={{
          labelContainer: classes.endLabels
        }}
        vertical
        showLabels={false}
        label={getLabelForVarName(yVar, {
          region: getRegionLabel(region)
        })}
      />
    </div>
  )
}

SedaScatterplotBase.defaultProps = {
  data: [],
  vars: [],
  extents: [],
  onHover: () => { },
  onClick: () => { },
  onReady: () => { }
}

SedaScatterplotBase.propTypes = {
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  region: PropTypes.string,
  data: PropTypes.array,
  selected: PropTypes.array,
  hovered: PropTypes.object,
  variant: PropTypes.string,
  children: PropTypes.node,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  error: PropTypes.string
}

export default withStyles(styles)(SedaScatterplotBase)
