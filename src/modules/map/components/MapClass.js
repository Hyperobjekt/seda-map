import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { defaultMapStyle } from '../selectors'
import { getClosest } from '../../../shared/utils'
import * as _debounce from 'lodash.debounce'
import { DEFAULT_VIEWPORT } from '../constants'
/**
 * Returns an array of layer ids for layers that have the
 * interactive property set to true
 */
const getInteractiveLayerIds = layers =>
  layers
    .filter(l => l.style.get('interactive'))
    .map(l => l.style.get('id'))

/**
 * Returns the map style with the provided layers inserted
 * @param {Map} style immutable Map of the base mapboxgl style
 * @param {array} layers list of layer objects containing style and z order
 */
const getUpdatedMapStyle = (style, layers) => {
  return style.set(
    'layers',
    layers.reduce(
      (newLayers, layer) =>
        newLayers.splice(layer.z, 0, layer.style),
      style.get('layers')
    )
  )
}

/**
 * Sets the state on a map feature with the provided ID
 * @param {*} featureId
 * @param {*} state
 * @param {*} layers
 * @param {*} map
 */
const setFeatureState = (
  featureId,
  state,
  layers,
  map,
  idMap = {}
) => {
  if (!featureId || !map) return
  const layer = layers.find(
    l => l.hasFeatureId && l.hasFeatureId(featureId)
  )
  const id = idMap[featureId] ? idMap[featureId] : featureId
  layer &&
    map.setFeatureState(
      {
        source: layer.style.get('source'),
        sourceLayer: layer.style.get('source-layer'),
        id
      },
      state
    )
}

class MapClass extends Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
    loaded: false
  }

  _handleViewportChange = viewport => {
    viewport.width &&
      viewport.height &&
      this.setState({ viewport })
  }

  // handler for feature hover
  _handleHover = ({ features, srcEvent }) => {
    const newHoveredFeature =
      features && features.length > 0 ? features[0] : null
    const coords =
      srcEvent && srcEvent.pageX && srcEvent.pageY
        ? [
            Math.round(srcEvent.pageX),
            Math.round(srcEvent.pageY)
          ]
        : null
    this.props.onHover(newHoveredFeature, coords)
  }

  // handler for feature click
  _handleClick = ({ features, srcEvent, ...rest }) => {
    // was the click on a control
    const isControl = getClosest(
      srcEvent.target,
      '.mapboxgl-ctrl-group'
    )
    // activate feature if one was clicked and this isn't a control click
    features &&
      features.length > 0 &&
      !isControl &&
      this.props.onClick(features[0])
  }

  // handler for map load
  _handleLoad = e => {
    if (!this.state.loaded) {
      this.setState({ ...this.state, loaded: true })
      // trigger load callback
      this.props.onLoad(e)
    }
  }

  render() {
    return (
      <ReactMapGL
        attributionControl={this.props.attributionControl}
        mapStyle={getUpdatedMapStyle(
          this.props.style,
          this.props.layers
        )}
        dragRotate={false}
        touchRotate={false}
        dragPan={true}
        touchZoom={true}
        interactiveLayerIds={getInteractiveLayerIds(
          this.props.layers
        )}
        onViewportChange={this._handleViewportChange}
        onHover={this._handleHover}
        onClick={this._handleClick}
        onLoad={this._handleLoad}
        {...this.state.viewport}>
        {this.props.children}
      </ReactMapGL>
    )
  }
}

MapClass.defaultProps = {
  style: defaultMapStyle,
  idMap: {},
  layers: [],
  attributionControl: true,
  selectedColors: ['#00ff00'],
  onClick: () => {},
  onLoad: () => {},
  onHover: () => {}
}

MapClass.propTypes = {
  style: PropTypes.object,
  layers: PropTypes.array,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  hoveredId: PropTypes.string,
  idMap: PropTypes.object,
  selectedColors: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  onViewportChange: PropTypes.func,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onLoad: PropTypes.func
}

export default MapClass
