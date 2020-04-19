import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import useResizeAware from 'react-resize-aware'

import debug from 'debug'
import ScatterplotBase, {
  fetchScatterplotVars,
  fetchReducedPair
} from '../../../scatterplot/components/ScatterplotBase'
import { theme } from '../../../scatterplot/echartTheme'
import {
  getBaseVars,
  isVersusFromVarNames
} from '../../../../shared/selectors'
import { getScatterplotOptions } from '../../../scatterplot/utils'

import * as merge from 'deepmerge'
import clsx from 'clsx'
import { getFilteredIds } from '../../../../shared/selectors/data'
import { useScatterplotData } from '../../hooks'
import {
  getLang,
  getLegendEndLabelsForVarName as getEndLabels,
  getLabelForVarName,
  getRegionLabel
} from '../../../../shared/selectors/lang'
import ScatterplotAxis from '../../../scatterplot/components/ScatterplotAxis'
import SedaLocationMarkers from './SedaLocationMarkers'
import { makeStyles } from '@material-ui/core'

// scatterplot width / height where left / right hints are not shown
const LABEL_BREAKPOINT = 500

const endpoint =
  process.env.REACT_APP_DATA_ENDPOINT + 'scatterplot/'

const log = debug('Scatterplot')

const getMissingVarNames = (data, varNames) =>
  data ? varNames.filter(v => !Boolean(data[v])) : varNames

const fetchVariables = (vars, regionId, stateId) => {
  if (!endpoint) {
    throw new Error('No endpoint specified for scatterplot')
  }
  log('fetching vars', vars)
  // get meta collection variables if any
  const collectionVars = getBaseVars()[regionId] || []
  return fetchScatterplotVars(
    vars,
    regionId,
    endpoint,
    collectionVars,
    stateId
  ).then(d => {
    log('fetched vars', d)
    return d
  })
}

const fetchSchoolPair = (xVar, yVar) => {
  if (!endpoint) {
    throw new Error('No endpoint specified for scatterplot')
  }
  log('fetching school pair', xVar, yVar)
  return fetchReducedPair(endpoint, xVar, yVar)
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
  // track size of scatterplot
  const [resizeListener, sizes] = useResizeAware()

  // scatterplot data store
  const [data, setData] = useScatterplotData()

  // store copy of scatterplot options
  // const [options, setOptions] = useState({})

  // scatterplot data for the current region
  const regionData = data[region]

  const isVersus = isVersusFromVarNames(xVar, yVar)

  // highlight ids based on filters
  const highlightIds = useMemo(() => {
    return getFilteredIds(regionData, filters, zVar).slice(
      0,
      3000
    )
  }, [regionData, filters, zVar])

  const showLabelsX =
    sizes && !isVersus && sizes.width > LABEL_BREAKPOINT

  const showLabelsY =
    sizes && !isVersus && sizes.height > LABEL_BREAKPOINT

  // classnames for markers and axis
  const classes = useStyles()

  // get list of vars needed to render current options
  const neededVars = getMissingVarNames(regionData, [
    xVar,
    yVar,
    zVar,
    'name'
  ])
  // fetch base vars for region if they haven't already been fetched
  // this is required as sometimes names are not available
  useEffect(() => {
    if (!autoFetch || neededVars.length === 0) return
    const promises = [
      fetchVariables(neededVars, region, filters.prefix)
    ]
    if (region === 'schools') {
      promises.push(fetchSchoolPair(xVar, yVar))
    }
    Promise.all(promises).then(dataArray => {
      setData(merge.all(dataArray), region)
      return dataArray
    })
    // disable lint, this doesn't need to fire when onData changes
    // eslint-disable-next-line
  }, [region, xVar, yVar, zVar, filters.prefix, neededVars])

  // fetch any additional school level data for highlighted states
  useEffect(() => {
    if (!autoFetch || region !== 'schools' || !filters.prefix)
      return
    fetchVariables(
      [xVar, yVar, zVar],
      'schools',
      filters.prefix
    ).then(data => {
      setData(data, 'schools')
      return data
    })
  }, [
    xVar,
    yVar,
    zVar,
    region,
    autoFetch,
    filters.prefix,
    setData
  ])

  const options = useMemo(() => {
    if (neededVars.length !== 0) return {}
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
    neededVars.length,
    highlightIds,
    regionData
  ])

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
        loading={neededVars.length !== 0}
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
