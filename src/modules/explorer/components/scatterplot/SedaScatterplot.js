import React, { useCallback, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  isVersusFromVarNames,
  getDemographicIdFromVarName,
  getSecondaryForDemographic
} from '../../selectors'
import ScatterplotBase from './SedaScatterplotBase'
import clsx from 'clsx'
import useResizeAware from 'react-resize-aware'

import {
  useScatterplotVars,
  useRegion,
  useFilters,
  useAddLocationById,
  useSecondary
} from '../../hooks'
import { SplitView } from '../base/SplitView'
import useUiStore from '../../hooks/useUiStore'
import { Typography } from '@material-ui/core'
import Footnotes from '../base/Footnotes'
import LinkButton from '../../../../shared/components/LinkButton'
import SedaGenericSelect from '../controls/SedaGenericSelect'
import { getFootnotes, getChartTitle } from './lang'
import {
  getLocatonIdFromEvent,
  getCoordsFromEvent,
  isMarkerRelated
} from './utils'

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
      background: theme.palette.background.default
    }
  },
  footnote: {
    position: 'absolute',
    left: 0,
    right: -1 * theme.spacing(6),
    bottom: -64,
    padding: `0 ${theme.spacing(2)}px`,
    height: 44
  },
  toggleButton: {
    display: 'block'
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
  const [, setSecondary] = useSecondary()
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

  const isVersus = isVersusFromVarNames(xVar, yVar)
  const gapDem = getDemographicIdFromVarName(yGapVar)
  const secondaryMetrics = getSecondaryForDemographic(gapDem)
  const hasSecondaryChart =
    isVersus && secondaryMetrics.length > 0

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
            onClick={handleClick}>
            <div
              className={clsx(
                'scatterplot__header',
                classes.header
              )}>
              <Typography variant="h6" color="textSecondary">
                {getChartTitle(xVar, yVar, region)}{' '}
                {!isSplit && hasSecondaryChart && (
                  <LinkButton
                    className={classes.toggleButton}
                    onClick={() => setShowGapChart(true)}>
                    Show gap vs. other metrics
                  </LinkButton>
                )}
              </Typography>
            </div>
            <Footnotes
              footnotes={getFootnotes(
                xVar,
                yVar,
                region,
                filters
              )}
              className={classes.footnote}
            />
          </ScatterplotBase>
        }
        RightComponent={
          hasSecondaryChart ? (
            <ScatterplotBase
              className={clsx('scatterplot--gap', classes.chart)}
              xVar={xGapVar}
              yVar={yGapVar}
              zVar={zGapVar}
              filters={filters}
              region={region}
              variant="map"
              axisChildren={
                <SedaGenericSelect
                  style={{
                    position: 'relative',
                    zIndex: 1000,
                    display: 'inline-block'
                  }}
                  items={secondaryMetrics}
                  onSelect={m => setSecondary(m)}>
                  Change
                </SedaGenericSelect>
              }
              onHover={handleHover}
              onClick={handleClick}>
              <div
                className={clsx(
                  'scatterplot__header',
                  classes.header
                )}>
                <Typography variant="h6" color="textSecondary">
                  {getChartTitle(xGapVar, yGapVar, region)}{' '}
                  {!isSplit && isVersus && (
                    <LinkButton
                      className={classes.toggleButton}
                      onClick={() => setShowGapChart(false)}>
                      Show Versus
                    </LinkButton>
                  )}
                </Typography>
              </div>

              <Footnotes
                footnotes={getFootnotes(
                  xGapVar,
                  yGapVar,
                  region,
                  filters
                )}
                className={classes.footnote}
              />
            </ScatterplotBase>
          ) : (
            <></>
          )
        }
        view={
          isSplit && hasSecondaryChart
            ? 'split'
            : showGapChart && hasSecondaryChart
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
