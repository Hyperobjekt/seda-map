import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  getScatterplotVars,
  isVersusFromVarNames
} from '../../../shared/selectors'
import * as _debounce from 'lodash.debounce'
import { getStateFipsFromAbbr } from '../../../shared/selectors/states'
import Scatterplot from '../../scatterplot/components/AltScatterplot'
import useScatterplotStore from '../hooks/useScatterplotStore'
import useDataOptions from '../hooks/useDataOptions'
import useUiStore from '../hooks/useUiStore'
import clsx from 'clsx'
import BookEnds from '../../../base/components/BookEnds'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import {
  getLegendEndLabelsForVarName as getEndLabels,
  getLabelForVarName,
  getRegionLabel
} from '../../../shared/selectors/lang'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: `calc(100% - ${theme.spacing(8)}px)`,
    marginRight: theme.spacing(8),
    marginBottom: theme.spacing(8)
  },
  axisLabels: {},
  axisLabelsX: {},
  axisLabelsY: {}
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

const SedaScatterplot = () => {
  // ref to track the timeout that clears the tooltip
  const timeoutRef = useRef(null)

  // pull required data from store
  const region = useDataOptions(state => state.region)
  const { xVar, yVar, zVar } = useDataOptions(state =>
    state.getScatterplotVars()
  )
  const highlightedState = null
  const setHovered = useUiStore(state => state.setHovered)
  const addLocation = useDataOptions(
    state => state.addLocationFromChart
  )

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
      if (e.type === 'mouseout') {
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
    location => {
      console.log(location)
      addLocation(location)
    },
    [addLocation]
  )

  // handle errors loading data
  const handleError = () => {}

  const isVersus = isVersusFromVarNames(xVar, yVar)
  const [startLabelX, endLabelX] = getEndLabels(xVar)
  const [startLabelY, endLabelY] = getEndLabels(yVar)
  const classes = useStyles()
  return (
    <Scatterplot
      xVar={xVar}
      yVar={yVar}
      zVar={zVar}
      className={clsx(classes.root, {
        'scatterplot--versus': isVersus
      })}
      region={region.id}
      variant="map"
      highlightedState={getStateFipsFromAbbr(highlightedState)}
      onHover={handleHover}
      onClick={handleClick}
      onError={handleError}>
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
            region: getRegionLabel(region.id)
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
            region: getRegionLabel(region.id)
          })}
        </Typography>
      </BookEnds>
    </Scatterplot>
  )
}

export default SedaScatterplot
