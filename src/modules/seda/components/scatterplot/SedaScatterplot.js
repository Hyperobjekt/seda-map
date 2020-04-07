import React, { useCallback, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { isVersusFromVarNames } from '../../../../shared/selectors'
import ScatterplotBase from './SedaScatterplotBase'
import clsx from 'clsx'
import BookEnds from '../../../../base/components/BookEnds'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import {
  getLegendEndLabelsForVarName as getEndLabels,
  getLabelForVarName,
  getRegionLabel
} from '../../../../shared/selectors/lang'
import { Typography } from '@material-ui/core'
import SedaLocationMarkers from './SedaLocationMarkers'
import {
  useHovered,
  useScatterplotVars,
  useRegion,
  useFilters,
  useAddLocationById
} from '../../hooks'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: `calc(100% - ${theme.spacing(8)}px)`,
    marginRight: theme.spacing(8),
    marginBottom: theme.spacing(8)
  },
  markers: {
    top: 24,
    left: 24,
    bottom: 24,
    right: 64
  }
}))

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

const SedaScatterplot = () => {
  // ref to track the timeout that clears the tooltip
  const timeoutRef = useRef(null)

  // pull required data from store
  const [region] = useRegion()
  const [filters] = useFilters()
  const [xVar, yVar, zVar] = useScatterplotVars()
  const [, setHovered] = useHovered()
  const addLocationFromId = useAddLocationById()

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
  const [startLabelX, endLabelX] = getEndLabels(xVar)
  const [startLabelY, endLabelY] = getEndLabels(yVar)
  const classes = useStyles()
  return (
    <ScatterplotBase
      xVar={xVar}
      yVar={yVar}
      zVar={zVar}
      filters={filters}
      className={clsx(classes.root, {
        'scatterplot--versus': isVersus
      })}
      region={region}
      variant="map"
      onHover={handleHover}
      onClick={handleClick}
      onError={handleError}>
      <SedaLocationMarkers className={classes.markers} />
      <BookEnds
        style={{
          position: 'absolute',
          bottom: -40,
          left: 0,
          right: 0
        }}
        startLabel={startLabelX}
        endLabel={endLabelX}
        startIcon={<ArrowLeft />}
        endIcon={<ArrowRight />}>
        <Typography
          variant="body1"
          style={{ textTransform: 'capitalize' }}>
          {getLabelForVarName(xVar, {
            region: getRegionLabel(region)
          })}
        </Typography>
      </BookEnds>
      <BookEnds
        style={{
          position: 'absolute',
          right: -40,
          top: 0,
          bottom: 0,
          width: 0
        }}
        vertical
        startLabel={startLabelY}
        endLabel={endLabelY}
        startIcon={<ArrowLeft />}
        endIcon={<ArrowRight />}>
        <Typography
          style={{ textTransform: 'capitalize' }}
          variant="body1">
          {getLabelForVarName(yVar, {
            region: getRegionLabel(region)
          })}
        </Typography>
      </BookEnds>
    </ScatterplotBase>
  )
}

export default SedaScatterplot
