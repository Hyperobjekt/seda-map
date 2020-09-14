import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from 'react'
import useResizeAware from 'react-resize-aware'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import { fromJS } from 'immutable'
import PropTypes from 'prop-types'
import usePrevious from '../../../shared/hooks/usePrevious'
import { defaultMapStyle } from '../selectors'
import { getClosest } from '../utils'
import { useMapViewport, useFlyToReset } from '../store'
import ZoomToControl from './ZoomToControl'
import useMapStore from '../store'
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
const getUpdatedMapStyle = (
  style,
  layers,
  sources = fromJS({})
) => {
  const updatedSources = style.get('sources').merge(sources)
  const updatedLayers = layers.reduce(
    (newLayers, layer) =>
      newLayers.splice(layer.z, 0, layer.style),
    style.get('layers')
  )
  return style
    .set('sources', updatedSources)
    .set('layers', updatedLayers)
}

const MapBase = ({
  style,
  attributionControl,
  hoveredId,
  selectedIds,
  layers,
  sources,
  children,
  idMap,
  selectedColors,
  defaultViewport,
  ariaLabel,
  onHover,
  onClick,
  onLoad,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false)

  const [resizeListener, sizes] = useResizeAware()

  const [viewport, setViewport] = useMapViewport()

  const setResetViewport = useMapStore(
    state => state.setResetViewport
  )

  const flyToReset = useFlyToReset()

  // reference to map container DOM element
  const mapEl = useRef(null)

  // refernce to the ReactMapGL instance
  const mapRef = useRef(null)

  const currentMap =
    mapRef &&
    mapRef.current &&
    mapRef.current.getMap &&
    mapRef.current.getMap()

  // canvas element
  const canvas =
    currentMap && currentMap.getCanvas && currentMap.getCanvas()

  // storing previous hover / selected IDs
  const prev = usePrevious({
    hoveredId,
    selectedIds
  })

  /**
   * Sets the feature state for rendering styles
   * @param {string} featureId
   * @param {object} state
   */
  const setFeatureState = useCallback(
    (featureId, state) => {
      if (
        !loaded ||
        !featureId ||
        !currentMap ||
        !currentMap.setFeatureState
      )
        return
      const layer = layers.find(
        l => l.hasFeatureId && l.hasFeatureId(featureId)
      )
      const id = idMap[featureId] ? idMap[featureId] : featureId
      if (layer) {
        const source = {
          source: layer.style.get('source'),
          sourceLayer: layer.style.get('source-layer'),
          id
        }
        currentMap.setFeatureState(source, state)
      }
    },
    [layers, idMap, currentMap, loaded]
  )

  // update map style layers when layers change
  const mapStyle = useMemo(
    () => getUpdatedMapStyle(style, layers, sources),
    [style, layers, sources]
  )

  // update list of interactive layer ids when layers change
  const interactiveLayerIds = useMemo(
    () => getInteractiveLayerIds(layers),
    [layers]
  )

  useEffect(() => {
    if (canvas) {
      canvas.setAttribute('aria-label', ariaLabel)
    }
  }, [ariaLabel, canvas])

  // handler for map load
  const handleLoad = e => {
    if (!loaded) {
      setLoaded(true)
      // HACK: remove tabindex from map div
      const tabindexEl = document.querySelector(
        '.map:first-child'
      )
      if (tabindexEl) {
        tabindexEl.children[0].removeAttribute('tabindex')
      }
      // add screen reader content for map
      if (canvas) {
        canvas.setAttribute('role', 'img')
        canvas.setAttribute('aria-label', ariaLabel)
      }
      // add geolocation
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
      const controlContainer = document.querySelector(
        '.map__zoom:first-child'
      )
      if (controlContainer && currentMap) {
        controlContainer.appendChild(
          geolocateControl.onAdd(currentMap)
        )
      }
      // trigger load callback
      if (typeof onLoad === 'function') {
        onLoad(e)
      }
    }
  }

  // handler for viewport change, debounced to prevent
  // race errors
  const handleViewportChange = useCallback(
    (vp, options = {}) => {
      if (!loaded) return
      if (vp.zoom && vp.zoom < 2) return
      setViewport(vp)
    },
    [setViewport, loaded]
  )

  // handler for feature hover
  const handleHover = ({ features, point, srcEvent }) => {
    const newHoveredFeature =
      features && features.length > 0 ? features[0] : null
    const coords =
      srcEvent && srcEvent.pageX && srcEvent.pageY
        ? [
            Math.round(srcEvent.pageX),
            Math.round(srcEvent.pageY)
          ]
        : null
    onHover(newHoveredFeature, coords)
  }

  // handler for feature click
  const handleClick = ({ features, srcEvent, ...rest }) => {
    // was the click on a control
    const isControl = getClosest(
      srcEvent.target,
      '.mapboxgl-ctrl-group'
    )
    // activate feature if one was clicked and this isn't a control click
    features &&
      features.length > 0 &&
      !isControl &&
      onClick(features[0])
  }

  // set the default / reset viewport when it changes
  useEffect(() => {
    setResetViewport(defaultViewport)
  }, [defaultViewport, setResetViewport])

  // set the default viewport on mount
  useEffect(() => {
    defaultViewport && setViewport(defaultViewport)
  }, [])

  // set the map dimensions when the size changes
  useEffect(() => {
    setViewport({
      width: sizes.width,
      height: sizes.height
    })
  }, [sizes, setViewport])

  // set hovered outline when hoveredId changes
  useEffect(() => {
    prev &&
      prev.hoveredId &&
      setFeatureState(prev.hoveredId, {
        hover: false
      })
    hoveredId && setFeatureState(hoveredId, { hover: true })
    // eslint-disable-next-line
  }, [hoveredId, loaded]) // update only when hovered id changes

  // set selected outlines when selected IDs change
  useEffect(() => {
    prev &&
      prev.selectedIds &&
      prev.selectedIds.forEach(id =>
        setFeatureState(id, { selected: false })
      )
    selectedIds.forEach((id, i) =>
      setFeatureState(id, {
        selected: selectedColors[i % selectedColors.length]
      })
    )
    // eslint-disable-next-line
  }, [selectedIds, loaded]) // update only when selected ids change

  /** handler for resetting the viewport */
  const handleResetViewport = e => {
    e.preventDefault()
    flyToReset()
  }

  return (
    <div
      id="map"
      className="map"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%'
      }}
      ref={mapEl}
      onMouseLeave={() =>
        handleHover({
          features: null,
          point: [null, null]
        })
      }>
      {resizeListener}
      <ReactMapGL
        ref={mapRef}
        attributionControl={attributionControl}
        mapStyle={mapStyle}
        dragRotate={false}
        touchRotate={false}
        dragPan={true}
        touchZoom={true}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={handleViewportChange}
        onHover={handleHover}
        onClick={handleClick}
        onLoad={handleLoad}
        {...viewport}
        {...rest}>
        <div className="map__zoom">
          <NavigationControl
            showCompass={false}
            onViewportChange={setViewport}
          />
          <ZoomToControl
            title="Reset Zoom"
            onClick={handleResetViewport}
          />
        </div>
        {children}
      </ReactMapGL>
    </div>
  )
}

MapBase.defaultProps = {
  style: defaultMapStyle,
  idMap: {},
  layers: [],
  attributionControl: true,
  selectedColors: ['#00ff00']
}

MapBase.propTypes = {
  style: PropTypes.object,
  layers: PropTypes.array,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  hoveredId: PropTypes.string,
  idMap: PropTypes.object,
  selectedColors: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onLoad: PropTypes.func
}

export default MapBase
