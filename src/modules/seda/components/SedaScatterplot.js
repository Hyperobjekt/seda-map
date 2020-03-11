import React from 'react'
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

const SedaScatterplot = ({ ...props }) => {
  // pull required data from store
  const region = useDataOptions(state => state.region)
  const metric = useDataOptions(state => state.metric)
  const demographic = useDataOptions(state => state.demographic)
  const hovered = useUiStore(state => state.hovered)
  const highlightedState = null
  const data = useScatterplotStore(state => state.data)

  const setData = useScatterplotStore(state => state.setData)
  const setLoading = useScatterplotStore(
    state => state.setLoading
  )
  const setHovered = useUiStore(state => state.setHovered)
  const setCoords = useUiStore(state => state.setCoords)
  const setTooltipVars = useUiStore(
    state => state.setTooltipVars
  )
  const addLocation = useDataOptions(
    state => state.addLocationFromChart
  )

  const handleData = (data, region) => {
    setData(data, region)
  }

  const handleReady = () => {
    setLoading(false)
  }

  const handleHover = (feature, vars, e) => {
    setHovered(feature)
    setCoords([e.pageX, e.pageY])
    setTooltipVars([vars.xVar, vars.yVar])
  }

  const handleClick = location => {
    console.log(location)
    addLocation(location)
  }

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
      data={data}
      className={clsx(classes.root, {
        'scatterplot--versus': isVersus
      })}
      region={region.id}
      variant="map"
      highlightedState={getStateFipsFromAbbr(highlightedState)}
      onData={handleData}
      onReady={handleReady}
      onHover={handleHover}
      onClick={handleClick}
      onError={handleError}>
      {/* <ScatterplotAxis
        axis="y"
        varName={vars.yVar}
        hovered={hovered}
        region={region.id}
        className="scatterplot__axis scatterplot__axis--y"
      />
      <ScatterplotAxis
        axis="x"
        varName={vars.xVar}
        hovered={hovered}
        region={region.id}
        className="scatterplot__axis scatterplot__axis--x"
      /> */}
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
