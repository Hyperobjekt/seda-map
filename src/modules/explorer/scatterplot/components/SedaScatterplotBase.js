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
  getRegionLabel
} from '../../app/selectors/lang'
import SedaLocationMarkers from './SedaLocationMarkers'
import useStaticData from '../../../data/useStaticData'
import { useAppContext } from '../../app/hooks'
import { getScatterplotOptions } from '../style'

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
  className,
  classes: overrides,
  variant,
  gapChart = false,
  axisChildren,
  children,
  onHover,
  onClick,
  onReady,
  ...props
}) {
  // classnames for markers and axis
  const classes = useStyles()

  // boolean indicating if data is loading
  const loading = useStaticData(state => state.isLoading)

  // scatterplot data store
  const {
    scatterplotData,
    scatterplotVars,
    gapVars,
    gapExtents,
    scatterplotExtents,
    colorExtent,
    region
  } = useAppContext()

  const [xVar, yVar, zVar] = gapChart ? gapVars : scatterplotVars
  const extents = gapChart ? gapExtents : scatterplotExtents

  // memoize the scatterplot options
  const options = useMemo(() => {
    return getScatterplotOptions(variant, {
      data: scatterplotData,
      xVar,
      yVar,
      zVar,
      extents,
      colorExtent,
      region
    })
  }, [
    variant,
    scatterplotData,
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
