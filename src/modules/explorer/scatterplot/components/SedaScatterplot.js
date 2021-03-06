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
import SelectMenu from '../../../../shared/components/Inputs/SelectMenu'
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
    top: theme.spacing(12),
    left: theme.spacing(4),
    right: theme.spacing(8),
    bottom: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      left: theme.spacing(1),
      right: theme.spacing(6)
    },
    '& .scatterplot-axis .MuiTypography-root.MuiTypography-body2': {
      fontSize: theme.typography.pxToRem(14)
    }
  },
  // make space for toggle button
  headerOffset: {
    [theme.breakpoints.up('sm')]: {
      right: 88
    }
  },
  toggleButton: {
    marginLeft: 0,
    minWidth: 80,
    maxWidth: 88,
    whiteSpace: 'normal',
    fontSize: theme.typography.pxToRem(12),
    position: 'absolute',
    top: theme.spacing(-8),
    right: -32,
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      top: -1,
      right: -88
    }
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
    isVersus,
    gapMetrics,
    hasGapChart,
    allData,
    scatterplotData,
    scatterplotVars,
    gapVars,
    gapExtents,
    scatterplotExtents,
    colorExtent
  } = useAppContext()
  const [xVar, yVar] = scatterplotVars
  const [xGapVar, yGapVar] = gapVars
  const [secondary, setSecondary] = useSecondary()
  const [setHovered, isEmbed, embedSecondary] = useUiStore(
    state => [
      state.setHovered,
      state.isEmbed,
      state.embedSecondary
    ],
    shallow
  )
  const addLocation = useAddLocation()
  // track state for split view of charts
  const [showGapChart, setShowGapChart] = useState(false)

  const isSplit =
    !isEmbed && sizes && sizes.width > SPLIT_BREAKPOINT

  // handle hover events
  const handleHover = useCallback(
    (e, eChartInstance, vars) => {
      // grab data from event
      const id = getLocatonIdFromEvent(e)
      const coords = getCoordsFromEvent(e)
      if (e.type === 'mouseover') {
        // set the current hovered ID and coords
        setHovered(id, coords, {
          showTooltip: true,
          showMarkers: true,
          forceVars: [vars[1], vars[0]] // y and x vars from chart
        })
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
          isEmbed && embedSecondary ? (
            <></>
          ) : (
            <SedaScatterplotBase
              className={clsx(classes.chart, {
                'scatterplot--versus': isVersus
              })}
              variant="map"
              data={scatterplotData}
              allData={allData}
              vars={scatterplotVars}
              extents={scatterplotExtents}
              colorExtent={colorExtent}
              region={region}
              onHover={handleHover}
              onClick={handleClick}>
              <SedaScatterplotHeader
                className={clsx({
                  [classes.headerOffset]: !isSplit && hasGapChart
                })}
                xVar={xVar}
                yVar={yVar}
                region={region}
                highlighted={scatterplotData.length}
                total={allData.length}>
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
              vars={gapVars}
              extents={gapExtents}
              data={scatterplotData}
              allData={allData}
              colorExtent={colorExtent}
              region={region}
              axisChildren={
                <SelectMenu
                  style={{
                    position: 'relative',
                    zIndex: 1000,
                    display: 'inline-block',
                    marginRight: 4
                  }}
                  value={secondary}
                  items={gapMetrics}
                  onSelect={m => setSecondary(m)}
                />
              }
              onHover={handleHover}
              onClick={handleClick}>
              <SedaScatterplotHeader
                className={clsx({
                  [classes.headerOffset]: !isSplit && isVersus
                })}
                xVar={xGapVar}
                yVar={yGapVar}
                region={region}
                highlighted={scatterplotData.length}
                total={allData.length}>
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
