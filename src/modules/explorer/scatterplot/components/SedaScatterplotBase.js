import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

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
  getMetricIdFromVarName
} from '../../app/selectors'
import HintIconButton from '../../../../shared/components/Buttons/HintIconButton'

/** These define the minimum / maximum extents, so that the midpoint is always kept in view */
const MIN_EXTENTS = {
  avg: [-0.5, 0.5],
  grd: [0.5, 1.5],
  coh: [-0.1, 0.1],
  ses: [-0.5, 0.5],
  avg_gap: [-0.5, 0.5],
  grd_gap: [0.5, 1.5],
  coh_gap: [-0.1, 0.1],
  ses_gap: [-0.5, 0.5],
  seg_gap: [-0.5, 0.5],
  min_gap: [-0.1, 0.1]
}

const useStyles = makeStyles(theme => ({
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
}))

function SedaScatterplotBase({
  className,
  classes: overrides,
  variant,
  gapChart = false,
  axisChildren,
  children,
  onHover,
  onClick,
  onReady,
  data,
  vars,
  extents,
  colorExtent,
  region,
  ...props
}) {
  // classnames for markers and axis
  const classes = useStyles()

  // boolean indicating if data is loading
  const loading = useStaticData(state => state.isLoading)

  const [xVar, yVar, zVar] = vars

  const xLabel = gapChart
    ? getDemographicIdFromVarName(xVar)
    : xVar
  const xLabelPrefix = gapChart ? 'LABEL_GAP' : 'LABEL'
  const xMetric = getMetricIdFromVarName(xVar)
  // hint metrics that do no have explanation elsewhere
  const hasAxisHint = ['ses', 'seg', 'min'].indexOf(xMetric) > -1

  console.log('extents', extents)

  // memoize the scatterplot options
  const options = useMemo(() => {
    // sort data by zVar, so large circles are rendered below small circles
    // const sortedData = [...scatterplotData].sort((a, b) => {
    //   return b[zVar] - a[zVar]
    // })
    return getScatterplotOptions(variant, {
      data,
      xVar,
      yVar,
      zVar,
      extents,
      colorExtent,
      region
    })
  }, [
    variant,
    data,
    xVar,
    yVar,
    zVar,
    extents,
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
        className={clsx(
          'scatterplot__markers',
          classes.markers,
          overrides.markers
        )}
        vars={vars}
        extents={extents}
        region={region}
        gapChart={gapChart}
      />
      <ScatterplotAxis
        className={clsx(
          'scatterplot__axis--x',
          classes.axis,
          classes.xAxis,
          overrides.axis,
          overrides.xAxis
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
          classes.yAxis,
          overrides.axis,
          overrides.yAxis
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
  classes: {},
  data: [],
  vars: [],
  extents: [],
  onHover: () => {},
  onClick: () => {},
  onReady: () => {}
}

SedaScatterplotBase.propTypes = {
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  region: PropTypes.string,
  data: PropTypes.object,
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

export default SedaScatterplotBase
