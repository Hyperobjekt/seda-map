import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import useResizeAware from 'react-resize-aware'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

import ScatterplotBase, {
  ScatterplotAxis
} from '../../../scatterplot'
import { theme } from './theme'
import { isVersusFromVarNames } from '../../selectors'
import { getScatterplotOptions } from './style'
import { getFilteredIds } from './selectors'
import useScatterplotStore from './store'
import {
  getLang,
  getLegendEndLabelsForVarName as getEndLabels,
  getLabelForVarName,
  getRegionLabel
} from '../../selectors/lang'
import SedaLocationMarkers from './SedaLocationMarkers'

// scatterplot width / height where left / right hints are not shown
const LABEL_BREAKPOINT = 500

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
    bottom: `calc(-1 * var(--sp-bottom))`,
    left: 0,
    right: 0,
    width: 'auto'
  },
  yAxis: {
    right: `calc(-0.5 * var(--sp-right))`,
    top: 0,
    bottom: 0,
    width: 0
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
  xVar,
  yVar,
  zVar,
  className,
  classes: overrides,
  region,
  variant,
  filters,
  autoFetch,
  axisChildren,
  children,
  onHover,
  onClick,
  onReady,
  onError,
  ...props
}) {
  // classnames for markers and axis
  const classes = useStyles()

  // track size of scatterplot
  const [resizeListener, sizes] = useResizeAware()

  // scatterplot data store
  const { data, loadData, loading } = useScatterplotStore()

  // scatterplot data for the current region
  const regionData = data[region]

  // boolean determining if vars have two different dems
  const isVersus = isVersusFromVarNames(xVar, yVar)

  // highlight ids based on filters
  const highlightIds = useMemo(() => {
    return getFilteredIds(regionData, filters, zVar).slice(
      0,
      3000
    )
  }, [regionData, filters, zVar])

  // load the data on changes, if needed
  useEffect(() => {
    if (!autoFetch) return
    loadData([xVar, yVar, zVar, 'name'], region, filters.prefix)
  }, [
    region,
    xVar,
    yVar,
    zVar,
    filters.prefix,
    autoFetch,
    loadData
  ])

  // memoize the scatterplot options
  const options = useMemo(() => {
    if (loading) return {}
    const newOptions = getScatterplotOptions(
      variant,
      regionData,
      { xVar, yVar, zVar },
      highlightIds,
      region
    )
    return newOptions
  }, [
    xVar,
    yVar,
    zVar,
    region,
    variant,
    highlightIds,
    regionData,
    loading
  ])

  // boolean determining if X axis labels should show
  const showLabelsX =
    sizes && !isVersus && sizes.width > LABEL_BREAKPOINT

  // boolean determining if Y axis labels should show
  const showLabelsY =
    sizes && !isVersus && sizes.height > LABEL_BREAKPOINT

  const [startLabelX, endLabelX] = getEndLabels(xVar)
  const [startLabelY, endLabelY] = getEndLabels(yVar)

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
      {resizeListener}
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
        xVar={xVar}
        yVar={yVar}
        zVar={zVar}
        region={region}
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
        minLabel={startLabelX}
        maxLabel={endLabelX}
        showLabels={showLabelsX}
        label={getLabelForVarName(xVar, {
          region: getRegionLabel(region)
        })}>
        {axisChildren}
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
        minLabel={startLabelY}
        maxLabel={endLabelY}
        showLabels={showLabelsY}
        label={getLabelForVarName(yVar, {
          region: getRegionLabel(region)
        })}
      />
    </div>
  )
}

SedaScatterplotBase.defaultProps = {
  classes: {},
  filters: { prefix: null, largest: null },
  autoFetch: true,
  onHover: () => {},
  onClick: () => {},
  onReady: () => {},
  onError: () => {}
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
