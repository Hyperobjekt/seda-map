import React, { useCallback, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SedaScatterplotBase from './SedaScatterplotBase'
import clsx from 'clsx'
import useResizeAware from 'react-resize-aware'
import {
  useAppContext,
  useSecondary,
  useUiStore
} from '../../app/hooks'
import { LinkButton, SplitView } from '../../../../shared'
import SedaGenericSelect from '../../../../shared/components/Inputs/SelectMenu'
import {
  getLocatonIdFromEvent,
  getCoordsFromEvent,
  isMarkerRelated
} from '../utils'
import { useAddLocation } from '../../location'
import SedaScatterplotHeader from './SedaScatterplotHeader'
import shallow from 'zustand/shallow'

/** Breakpoint where gap chart is split vs overlay */
const SPLIT_BREAKPOINT = 1024

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    userSelect: 'none'
  },
  chart: {
    position: 'absolute',
    top: theme.spacing(9),
    left: theme.spacing(4),
    right: theme.spacing(8),
    bottom: theme.spacing(6)
  },
  // make space for toggle button
  headerOffset: {
    right: 88
  },
  toggleButton: {
    position: 'absolute',
    top: -1,
    right: -88,
    marginLeft: 0,
    width: 80,
    whiteSpace: 'normal',
    fontSize: theme.typography.pxToRem(12)
  }
}))

const SedaScatterplot = () => {
  // ref to track the timeout that clears the tooltip
  const timeoutRef = useRef(null)

  // track size of chart area
  const [resizeListener, sizes] = useResizeAware()

  // pull required items from the app context
  const {
    region,
    scatterplotVars: [xVar, yVar],
    gapVars: [xGapVar, yGapVar],
    isVersus,
    gapMetrics,
    hasGapChart
  } = useAppContext()
  const [, setSecondary] = useSecondary()
  const [setHovered, isEmbed, embedSecondary] = useUiStore(state => [state.setHovered, state.isEmbed, state.embedSecondary], shallow)
  const addLocation = useAddLocation()
  // track state for split view of charts
  const [showGapChart, setShowGapChart] = useState(false)

  const isSplit = !isEmbed && sizes && sizes.width > SPLIT_BREAKPOINT

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
      addLocation(id)
    },
    [addLocation]
  )

  const classes = useStyles()
  return (
    <div className={clsx(classes.root)}>
      {resizeListener}
      <SplitView
        LeftComponent={
          isEmbed && embedSecondary ? <></> : (
          <SedaScatterplotBase
            className={clsx(classes.chart, {
              'scatterplot--versus': isVersus
            })}
            variant="map"
            onHover={handleHover}
            onClick={handleClick}>
            <SedaScatterplotHeader
              className={clsx({
                [classes.headerOffset]: !isSplit && hasGapChart
              })}
              xVar={xVar}
              yVar={yVar}
              region={region}>
              {!isSplit && hasGapChart && !isEmbed && (
                <LinkButton
                  className={classes.toggleButton}
                  onClick={() => setShowGapChart(true)}>
                  Show gap vs. other metrics
                </LinkButton>
              )}
            </SedaScatterplotHeader>
          </SedaScatterplotBase>
          )
        }
        RightComponent={
          hasGapChart ? (
            <SedaScatterplotBase
              className={clsx('scatterplot--gap', classes.chart)}
              gapChart
              variant="map"
              axisChildren={
                <SedaGenericSelect
                  style={{
                    position: 'relative',
                    zIndex: 1000,
                    display: 'inline-block'
                  }}
                  items={gapMetrics}
                  onSelect={m => setSecondary(m)}>
                  Change
                </SedaGenericSelect>
              }
              onHover={handleHover}
              onClick={handleClick}>
              <SedaScatterplotHeader
                className={clsx({
                  [classes.headerOffset]: !isSplit && isVersus
                })}
                xVar={xGapVar}
                yVar={yGapVar}
                region={region}>
                {!isSplit && isVersus && !isEmbed && (
                  <LinkButton
                    className={classes.toggleButton}
                    onClick={() => setShowGapChart(false)}>
                    Show Versus
                  </LinkButton>
                )}
              </SedaScatterplotHeader>
            </SedaScatterplotBase>
          ) : (
            <></>
          )
        }
        view={
          isSplit && hasGapChart
            ? 'split'
            : (showGapChart || embedSecondary) && hasGapChart
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
