import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  getScatterplotVars,
  isVersusFromVarNames
} from '../../../shared/selectors'
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
  getLegendEndLabelsForVarName,
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
  // pull required data from store
  const region = useDataOptions(state => state.region)
  const metric = useDataOptions(state => state.metric)
  const demographic = useDataOptions(state => state.demographic)
  const highlightedState = null
  const setHovered = useUiStore(state => state.setHovered)
  const addLocation = useDataOptions(
    state => state.addLocationFromChart
  )

  const handleHover = useCallback(
    e => {
      const id = getLocatonIdFromEvent(e)
      const coords = getCoordsFromEvent(e)
      console.log(id, coords)
      e.type === 'mouseover' && setHovered(id, coords)
    },
    [setHovered]
  )

  const handleClick = useCallback(
    location => {
      console.log(location)
      addLocation(location)
    },
    [addLocation]
  )

  const handleError = () => {}

  const vars = getScatterplotVars(
    region.id,
    metric.id,
    demographic.id
  )
  const isVersus = isVersusFromVarNames(vars.xVar, vars.yVar)
  const [startLabelX, endLabelX] = getLegendEndLabelsForVarName(
    vars.xVar,
    'LEGEND_'
  )
  const [startLabelY, endLabelY] = getLegendEndLabelsForVarName(
    vars.yVar,
    'LEGEND_'
  )
  const classes = useStyles()
  return (
    <Scatterplot
      xVar={vars.xVar}
      yVar={vars.yVar}
      zVar={vars.zVar}
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
          {getLabelForVarName(vars.xVar, {
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
          {getLabelForVarName(vars.yVar, {
            region: getRegionLabel(region.id)
          })}
        </Typography>
      </BookEnds>
    </Scatterplot>
  )
}

SedaScatterplot.propTypes = {}

// const mapStateToProps = (
//   { scatterplot: { data }, sections: { hovered } },
//   {
//     match: {
//       params: {
//         region,
//         metric,
//         secondary,
//         demographic,
//         highlightedState
//       }
//     }
//   }
// ) => {
//   return {
//     region,
//     metric,
//     secondary,
//     demographic,
//     highlightedState,
//     hovered,
//     data
//   }
// }

// const mapDispatchToProps = dispatch => ({
//   onData: (data, region) =>
//     dispatch(onScatterplotData(data, region)),
//   onReady: () => dispatch(onScatterplotLoaded('map')),
//   onHover: (feature, vars, e) => {
//     dispatch(
//       onHoverFeature(feature, { x: e.pageX, y: e.pageY }, vars)
//     )
//     // dispatch(setTooltipVars(vars))
//     // dispatch(onCoordsChange({x: e.pageX, y: e.pageY }))
//   },

//   onClick: location => dispatch(loadLocation(location, 'chart')),
//   onError: (e, sectionId = 'map') => {
//     dispatch(onScatterplotError(e, sectionId))
//   }
// })

export default SedaScatterplot
