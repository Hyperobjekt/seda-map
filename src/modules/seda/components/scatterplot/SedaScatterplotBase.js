import React, { useMemo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import ScatterplotBase, {
  fetchScatterplotVars,
  fetchReducedPair
} from '../../../scatterplot/components/ScatterplotBase'
import { theme } from '../../../scatterplot/echartTheme'
import { getBaseVars } from '../../../../shared/selectors'
import { getScatterplotOptions } from '../../../scatterplot/utils'
import {
  getLang,
  getLabelForVarName
} from '../../../../shared/selectors/lang'
import * as merge from 'deepmerge'
import {
  getFeatureForId,
  getDataForId
} from '../../../scatterplot/components/ScatterplotBase/utils'
import clsx from 'clsx'
import { getFilteredIds } from '../../../../shared/selectors/data'
import { useScatterplotData } from '../../hooks'

const defaultFilters = { prefix: null, largest: null }
const defaultHandler = () => {}

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

const getLocatonIdFromEvent = (e, data) => {
  // index of the id property in the scatterplot data
  const idIndex = 3
  // get the data array for the hovered location
  const hoverData =
    e && e.data && e.data.hasOwnProperty('value')
      ? e.data['value']
      : e.data
  const id = hoverData ? hoverData[idIndex] : null
  // get the data from the state for the location
  return hoverData && e.type === 'mouseover'
    ? getFeatureForId(id, data)
    : null
}

function SedaScatterplotBase({
  xVar,
  yVar,
  zVar,
  className,
  region,
  variant,
  filters = defaultFilters,
  autoFetch = true,
  children,
  onHover = defaultHandler,
  onClick = defaultHandler,
  onReady = defaultHandler,
  onError = defaultHandler,
  ...props
}) {
  // scatterplot data store
  const [data, setData] = useScatterplotData()
  // store copy of scatterplot options
  const [options, setOptions] = useState({})
  // scatterplot data for the current region
  const regionData = data[region]
  // highlight ids based on filters
  const highlightIds = useMemo(() => {
    return getFilteredIds(regionData, filters, zVar).slice(
      0,
      3000
    )
  }, [regionData, filters.prefix, filters.largest, zVar])
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
  }, [region, xVar, yVar, zVar, neededVars])

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
  }, [xVar, yVar, zVar, region, filters.prefix, setData])

  useEffect(() => {
    if (neededVars.length !== 0) return
    const newOptions = getScatterplotOptions(
      variant,
      regionData,
      { xVar, yVar, zVar },
      highlightIds,
      region
    )
    setOptions(newOptions)
  }, [
    xVar,
    yVar,
    zVar,
    region,
    variant,
    highlightIds,
    regionData
  ])

  return (
    <div
      role="img"
      aria-label={getLang('UI_CHART_SR', {
        region,
        xVar: getLabelForVarName(xVar),
        yVar: getLabelForVarName(yVar)
      })}
      className={clsx('scatterplot', className)}
      {...props}>
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
    </div>
  )
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
