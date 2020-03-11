import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ScatterplotBase, {
  fetchScatterplotVars,
  fetchReducedPair
} from './ScatterplotBase'
import { theme } from '../echartTheme'
import { getBaseVars } from '../../../shared/selectors'
import { getScatterplotOptions } from '../utils'
import {
  getStateAbbr,
  getStateFipsFromAbbr
} from '../../../shared/selectors/states'
import {
  getLang,
  getLabelForVarName
} from '../../../shared/selectors/lang'
import * as merge from 'deepmerge'

const baseVars = getBaseVars()
const endpoint =
  process.env.REACT_APP_DATA_ENDPOINT + 'scatterplot/'

/**
 * Gets the state IDs that belong to a certain state
 * @param {array} ids
 * @param {string} fips
 */
const getStateIds = (ids, fips) => {
  if (ids && fips) {
    return ids.filter(d => d.substring(0, 2) === fips)
  }
  return []
}

/**
 * Gets the IDs for a provided state from the data
 * @param {string} stateId
 * @param {object} data
 */
const getStateHighlights = (stateId, data) => {
  return data && data['name'] && stateId
    ? getStateIds(Object.keys(data['name']), stateId)
    : []
}

const getMissingVarNames = (data, varNames) =>
  data ? varNames.filter(v => !Boolean(data[v])) : varNames

const fetchVariables = (vars, regionId, stateId) => {
  if (!endpoint) {
    throw new Error('No endpoint specified for scatterplot')
  }
  // get meta collection variables if any
  const collectionVars = getBaseVars()[regionId] || []
  return fetchScatterplotVars(
    vars,
    regionId,
    endpoint,
    collectionVars,
    stateId
  )
}

const fetchSchoolPair = (xVar, yVar) => {
  if (!endpoint) {
    throw new Error('No endpoint specified for scatterplot')
  }
  return fetchReducedPair(endpoint, xVar, yVar)
}

function Scatterplot({
  data = {},
  xVar,
  yVar,
  zVar,
  className,
  region,
  highlightedState,
  variant,
  freeze,
  children,
  onHover,
  onClick,
  onData,
  onReady,
  onError
}) {
  const regionData = data[region]

  const stateFips = getStateFipsFromAbbr(highlightedState)

  // memoize scatterplot options
  const scatterplotOptions = useMemo(() => {
    const options = getScatterplotOptions(
      variant,
      regionData,
      { xVar, yVar, zVar },
      highlightedState,
      region
    )
    return options
  }, [
    xVar,
    yVar,
    zVar,
    region,
    variant,
    highlightedState,
    regionData
  ])

  // memoize highlighted state IDs for the scatterplot
  const highlighted = useMemo(() => {
    const hl = getStateHighlights(highlightedState, regionData)
    // limit to 3000
    return hl.slice(0, 3000)
  }, [highlightedState, regionData])

  const neededVars = getMissingVarNames(regionData, [
    xVar,
    yVar,
    zVar,
    'name'
  ])
  // fetch base vars for region if they haven't already been fetched
  // this is required as sometimes names are not available
  useEffect(() => {
    if (neededVars.length === 0) return
    const promises = [
      fetchVariables(neededVars, region, highlightedState)
    ]
    if (region === 'schools') {
      promises.push(fetchSchoolPair(xVar, yVar))
    }
    Promise.all(promises).then(dataArray => {
      onData && onData(merge.all(dataArray), region)
      console.log(dataArray)
      return dataArray
    })
    // disable lint, this doesn't need to fire when onData changes
    // eslint-disable-next-line
  }, [region, xVar, yVar, zVar, neededVars])

  // fetch any additional school level data for highlighted states
  useEffect(() => {
    if (
      region === 'schools' &&
      highlightedState &&
      highlightedState !== 'us'
    ) {
      fetchVariables(
        [xVar, yVar, zVar],
        'schools',
        highlightedState
      ).then(data => {
        onData && onData(data, 'schools')
        return data
      })
    }
    // disable lint, this doesn't need to fire when onData changes
    // eslint-disable-next-line
  }, [xVar, yVar, zVar, region, highlightedState, freeze])

  return (
    <div
      role="img"
      aria-label={getLang('UI_CHART_SR', {
        region,
        xVar: getLabelForVarName(xVar),
        yVar: getLabelForVarName(yVar)
      })}
      className={classNames('scatterplot', className)}>
      <ScatterplotBase
        {...{
          endpoint,
          xVar,
          yVar,
          zVar,
          onReady,
          onClick,
          onData,
          onError,
          data: regionData,
          highlighted,
          theme,
          stateFips
        }}
        options={scatterplotOptions}
        metaVars={baseVars}
        classes={{ error: 'scatterplot__error' }}
        onHover={(loc, e) => {
          if (loc && loc.id) {
            return onHover(
              {
                id: loc.id,
                properties: {
                  ...loc,
                  state: getStateAbbr(loc.id)
                }
              },
              { xVar, yVar },
              e.event.event
            )
          }
          if (e.event.event.relatedTarget) {
            return (
              !e.event.event.relatedTarget.classList.contains(
                'marker'
              ) && onHover(null, {}, e.event.event)
            )
          } else {
            return onHover(null, {}, e.event.event)
          }
        }}
      />
      {children}
    </div>
  )
}

Scatterplot.propTypes = {
  heading: PropTypes.object,
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  region: PropTypes.string,
  data: PropTypes.object,
  highlightedState: PropTypes.string,
  selected: PropTypes.array,
  hovered: PropTypes.object,
  variant: PropTypes.string,
  children: PropTypes.node,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onData: PropTypes.func,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  freeze: PropTypes.bool,
  error: PropTypes.string
}

export default Scatterplot
