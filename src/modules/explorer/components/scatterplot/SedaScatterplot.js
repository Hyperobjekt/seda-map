import React, { useCallback, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { isVersusFromVarNames } from '../../../../shared/selectors'
import ScatterplotBase from './SedaScatterplotBase'
import clsx from 'clsx'
import useResizeAware from 'react-resize-aware'

import {
  useHovered,
  useScatterplotVars,
  useRegion,
  useFilters,
  useAddLocationById
} from '../../hooks'
import { SplitView } from '../base/SplitView'
import useUiStore from '../../hooks/useUiStore'
import { getChartTitle } from '../../../../shared/selectors/lang'
import { Typography, Button } from '@material-ui/core'

/** Breakpoint where gap chart is split vs overlay */
const SPLIT_BREAKPOINT = 1024

/** Helper to grab location ID from chart events */
const getLocatonIdFromEvent = e => {
  // index of the id property in the scatterplot data
  const idIndex = 3
  // get the data array for the hovered location
  const hoverData =
    e && e.data && e.data.hasOwnProperty('value')
      ? e.data['value']
      : e.data
  const id = hoverData ? hoverData[idIndex] : null
  // get the data from the state for the location
  return id
}

/**
 * Helper to grab event coordinates from chart events
 * @param {*} e event
 * @returns {[number, number]} [x, y]
 */
const getCoordsFromEvent = e => [
  e.event.event.pageX,
  e.event.event.pageY
]

/**
 * Checks if the event has a marker as a related event
 * @param {*} e
 */
const isMarkerRelated = e => {
  return !e.event.event.relatedTarget
    ? false
    : !e.event.event.relatedTarget.classList.contains('marker')
}

/**
 *
 * @param {*} xVar
 * @param {*} yVar
 */
const getFootnotes = (xVar, yVar) => {}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    userSelect: 'none'
  },
  chart: {
    position: 'absolute',
    top: theme.spacing(5),
    left: 0,
    right: theme.spacing(8),
    bottom: theme.spacing(8)
  },
  header: {
    position: 'absolute',
    padding: theme.spacing(2),
    left: theme.spacing(0.5),
    top: -1 * theme.spacing(5),
    right: -1 * theme.spacing(6),
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiTypography-root': {
      fontSize: theme.typography.pxToRem(12),
      lineHeight: 1.25,
      whiteSpace: 'normal',
      background: '#fafafa'
    }
  },
  footnote: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -64,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: 11,
    color: '#888',
    lineHeight: 1.25,
    whiteSpace: 'normal',
    height: 44,
    '& span': {
      marginRight: 4
    }
  },
  toggleButton: {
    display: 'block',
    padding: 0,
    margin: '0 auto',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    border: 0,
    fontSize: 12,
    background: 'none',
    '&:focus': {
      outline: 'none',
      boxShadow: `0 2px 0 ${theme.palette.primary.main}`
    }
  }
}))

const SedaScatterplot = () => {
  // ref to track the timeout that clears the tooltip
  const timeoutRef = useRef(null)

  // track size of chart area
  const [resizeListener, sizes] = useResizeAware()

  // pull required data from store
  const [region] = useRegion()
  const [filters] = useFilters()
  const [xVar, yVar, zVar] = useScatterplotVars()
  const [xGapVar, yGapVar, zGapVar] = useScatterplotVars('gap')
  const setHovered = useUiStore(state => state.setHovered)
  const addLocationFromId = useAddLocationById()

  // track state for split view of charts
  const [showGapChart, setShowGapChart] = useState(false)

  const isSplit = sizes && sizes.width > SPLIT_BREAKPOINT

  // handle hover events
  const handleHover = useCallback(
    e => {
      // grab data from event
      const id = getLocatonIdFromEvent(e)
      const coords = getCoordsFromEvent(e)
      if (e.type === 'mouseover') {
        // set the current hovered ID and coords
        setHovered(id, coords)
        // if the tooltip is going to be cleared, cancel it
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
      // set a timeout to clear the tooltip
      if (e.type === 'mouseout' && !isMarkerRelated(e)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(
          () => setHovered(null),
          400
        )
      }
    },
    [setHovered]
  )

  // handle click events
  const handleClick = useCallback(
    e => {
      // grab data from event
      const id = getLocatonIdFromEvent(e)
      addLocationFromId(id)
    },
    [addLocationFromId]
  )

  // handle errors loading data
  const handleError = () => {}

  const isVersus = isVersusFromVarNames(xVar, yVar)

  const classes = useStyles()
  return (
    <div className={clsx(classes.root)}>
      {resizeListener}
      <SplitView
        LeftComponent={
          <ScatterplotBase
            className={clsx(classes.chart, {
              'scatterplot--versus': isVersus
            })}
            xVar={xVar}
            yVar={yVar}
            zVar={zVar}
            filters={filters}
            region={region}
            variant="map"
            onHover={handleHover}
            onClick={handleClick}
            onError={handleError}>
            <div className={clsx(classes.header)}>
              <Typography variant="h6" color="textSecondary">
                {getChartTitle(xVar, yVar, region)}{' '}
                {!isSplit && isVersus && (
                  <button
                    className={classes.toggleButton}
                    onClick={() => setShowGapChart(true)}>
                    Show gap vs. other metrics
                  </button>
                )}
              </Typography>
            </div>
            <Typography className={clsx(classes.footnote)}>
              <span>
                Dotted line indicates no gap (White = Hispanic).
              </span>
              <span>
                Circles above dotted line indicate gap favoring
                White students.
              </span>
              <span>
                Circle size reflects number of assessments.
              </span>
            </Typography>
          </ScatterplotBase>
        }
        RightComponent={
          isVersus ? (
            <ScatterplotBase
              className={clsx('scatterplot--gap', classes.chart)}
              xVar={xGapVar}
              yVar={yGapVar}
              zVar={zGapVar}
              filters={filters}
              region={region}
              variant="map"
              onHover={handleHover}
              onClick={handleClick}
              onError={handleError}>
              <div className={clsx(classes.header)}>
                <Typography variant="h6" color="textSecondary">
                  {getChartTitle(xGapVar, yGapVar, region)}{' '}
                  {!isSplit && isVersus && (
                    <button
                      className={classes.toggleButton}
                      onClick={() => setShowGapChart(false)}>
                      Show White vs. Black
                    </button>
                  )}
                </Typography>
              </div>
            </ScatterplotBase>
          ) : (
            <></>
          )
        }
        view={
          isSplit && isVersus
            ? 'split'
            : showGapChart && isVersus
            ? 'right'
            : 'left'
        }
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}

export default SedaScatterplot
