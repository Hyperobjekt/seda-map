import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'

import {
  onHoverFeature,
  onScatterplotData,
  onScatterplotLoaded,
  onScatterplotError,
  loadRouteLocations
} from '../../../actions'

import Scatterplot from '../Scatterplot'
import {
  getTitle,
  getSubtitle
} from '../Scatterplot/ScatterplotHeading'
import ScatterplotAxis from '../../../modules/scatterplot/components/ScatterplotAxis'
import { getStateFipsFromAbbr } from '../../../selectors/states'
import SedaTooltip from '../../seda/SedaTooltip'
import Logo from '../../atoms/Logo'
import { Typography } from '@material-ui/core'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { getDemographicForVarNames } from '../../../shared/selectors'
import SedaLocations from '../../seda/SedaLocations'
import SedaLocationMarkers from '../../seda/SedaLocationMarkers'

const EmbedScatterplot = ({
  xVar,
  yVar,
  zVar,
  data,
  hovered,
  region,
  highlightedState,
  onReady,
  onData,
  onHover,
  onError,
  onClick
}) => {
  return (
    <Scatterplot
      {...{
        xVar,
        yVar,
        zVar,
        region,
        data,
        variant: 'map',
        className: 'scatterplot--embed',
        highlightedState: getStateFipsFromAbbr(highlightedState),
        onData,
        onReady,
        onHover,
        onClick,
        onError
      }}>
      <SedaLocationMarkers
        {...{ xVar, yVar, zVar }}
        onHover={onHover}
      />
      <ScatterplotAxis
        axis="y"
        varName={yVar}
        hovered={hovered}
        region={region}
        className="scatterplot__axis scatterplot__axis--y"
      />
      <ScatterplotAxis
        axis="x"
        varName={xVar}
        hovered={hovered}
        region={region}
        className="scatterplot__axis scatterplot__axis--x"
      />
    </Scatterplot>
  )
}

EmbedScatterplot.propTypes = {
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  data: PropTypes.object,
  hovered: PropTypes.object,
  region: PropTypes.string,
  highlightedState: PropTypes.string,
  onReady: PropTypes.func,
  onData: PropTypes.func,
  onHover: PropTypes.func,
  onError: PropTypes.func,
  onClick: PropTypes.func
}

function ChartEmbedView(props) {
  // flag potential layout change after loading locations
  useEffect(() => {
    if (props.locations) {
      props
        .loadRouteLocations(props.locations, props.region)
        .then(d => {
          console.log('loaded', d)
        })
    }
    // eslint-disable-next-line
  }, []) // only load on mount

  const metric = props.yVar.split('_')[1]
  const demographic = getDemographicForVarNames(
    props.xVar,
    props.yVar
  )
  // TODO: get X var metric instead of default to ses
  const secondary = props.region === 'schools' ? 'frl' : 'ses'
  const explorerUrl =
    'https://edopportunity.org/explorer/#/chart/' +
    props.highlightedState +
    '/' +
    props.region +
    '/' +
    metric +
    '/' +
    secondary +
    '/' +
    demographic +
    '/3.5/38/-97'
  return (
    <div
      className={classNames('chart-embed', {
        'chart-embed--locations': props.locations
      })}>
      <div className="chart-embed__header">
        <Logo url="https://edopportunity.org/" target="_blank" />
        <div className="chart-embed__heading">
          <Typography component="h1" variant="h5">
            {getTitle(props.xVar, props.yVar, props.region)}
          </Typography>
          <Typography variant="body1">
            {getSubtitle(
              props.xVar,
              props.yVar,
              props.region,
              props.highlightedState
            )}{' '}
            <a
              className="external-link"
              href={explorerUrl}
              rel="noopener noreferrer"
              target="_blank">
              <OpenInNew fontSize="small" />
              open full view
            </a>
          </Typography>
        </div>
      </div>
      <SedaTooltip />
      <EmbedScatterplot {...props} />
      <SedaLocations />
    </div>
  )
}

ChartEmbedView.propTypes = {
  region: PropTypes.string,
  xVar: PropTypes.string,
  yVar: PropTypes.string,
  zVar: PropTypes.string,
  highlightedState: PropTypes.string,
  hovered: PropTypes.object,
  data: PropTypes.object,
  locations: PropTypes.string
}

const mapStateToProps = (
  { scatterplot: { data }, sections: { hovered } },
  {
    match: {
      params: {
        xVar,
        yVar,
        zVar,
        region,
        highlightedState,
        locations
      }
    }
  }
) => {
  return {
    region,
    xVar,
    yVar,
    zVar,
    highlightedState,
    hovered,
    data,
    locations
  }
}

const mapDispatchToProps = dispatch => ({
  loadRouteLocations: (locations, region) =>
    dispatch(loadRouteLocations(locations, region)),
  onData: (data, region) =>
    dispatch(onScatterplotData(data, region)),
  onReady: () => {
    dispatch(onScatterplotLoaded('map'))
    window.SEDA.trigger('map')
  },
  onHover: (feature, vars, e) => {
    dispatch(
      onHoverFeature(feature, { x: e.pageX, y: e.pageY }, vars)
    )
    // dispatch(setTooltipVars(vars))
    // dispatch(onCoordsChange({x: e.pageX, y: e.pageY }))
  },
  onClick: () => {},
  onError: (e, sectionId = 'map') =>
    dispatch(onScatterplotError(e, sectionId))
})

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ChartEmbedView)
