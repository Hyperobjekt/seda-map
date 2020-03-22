import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import SedaScatterplot from 'react-seda-scatterplot'
import { theme } from '../echartTheme'
import { getBaseVars } from '../../../shared/selectors'
import { getScatterplotOptions } from '../utils'
import { getStateFipsFromAbbr } from '../../../shared/selectors/states'
import {
  getLang,
  getLabelForVarName
} from '../../../shared/selectors/lang'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

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
    ? getStateIds(
        Object.keys(data['name']),
        getStateFipsFromAbbr(stateId)
      )
    : []
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 1,
      bottom: 1,
      right: 1,
      left: 1,
      border: '1px solid',
      borderColor: theme.palette.divider,
      background: '#f00'
    }
  }
}))

function ScatterplotPreview({
  data,
  xVar,
  yVar,
  zVar,
  region,
  highlightedState,
  freeze,
  children,
  error,
  onError
}) {
  const classes = useStyles()
  const regionData = data && data[region]
  // memoize scatterplot options
  const scatterplotOptions = useMemo(() => {
    return getScatterplotOptions(
      'preview',
      regionData,
      { xVar, yVar, zVar },
      highlightedState,
      region
    )
  }, [xVar, yVar, zVar, highlightedState, regionData, region])
  // memoize highlighted state IDs for the scatterplot
  const highlighted = useMemo(() => {
    const hl = getStateHighlights(highlightedState, regionData)
    // limit to 3000
    return hl.slice(0, 3000)
  }, [highlightedState, regionData])

  const ariaLabel = getLang('UI_CHART_SR', {
    region,
    xVar: getLabelForVarName(xVar),
    yVar: getLabelForVarName(yVar)
  })
  return (
    <div
      role="img"
      aria-label={error ? null : ariaLabel}
      className={clsx('scatterplot-preview', classes.root)}
      style={{
        height: error ? '0px' : null,
        margin: error ? 0 : null
      }}>
      <SedaScatterplot
        {...{
          endpoint,
          xVar,
          yVar,
          zVar,
          onError,
          data,
          highlighted,
          theme,
          freeze
        }}
        prefix={region}
        options={scatterplotOptions}
        metaVars={baseVars}
      />
      {children}
    </div>
  )
}

ScatterplotPreview.propTypes = {
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  region: PropTypes.string,
  data: PropTypes.object,
  highlightedState: PropTypes.string,
  selected: PropTypes.array,
  hovered: PropTypes.object,
  children: PropTypes.node,
  onError: PropTypes.func,
  freeze: PropTypes.bool,
  error: PropTypes.bool
}

export default ScatterplotPreview
