import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import useResizeAware from 'react-resize-aware'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import PropTypes from 'prop-types'
import usePrevious from '../../../shared/hooks/usePrevious'
import ZoomToUSControl from './ZoomToControl'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import * as _debounce from 'lodash.debounce'
import { defaultMapStyle } from '../selectors'
/**
 * Returns the width and height of the provided element
 */
const getContainerSize = el => {
  if (!el) {
    return { width: 400, height: 400 }
  }
  return {
    width: el.clientWidth,
    height: el.clientHeight
  }
}

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

const isSameViewport = (vp1, vp2) =>
  ['width', 'height', 'latitude', 'longitude', 'zoom'].reduce(
    (acc, curr) => (acc ? vp1[curr] === vp2[curr] : false),
    true
  )

const MapBase = ({
  style = defaultMapStyle,
  attributionControl = true,
  hoveredId,
  selectedIds,
  layers = [],
  viewport = {},
  children,
  idMap,
  selectedColors = ['#00ff00'],
  ariaLabel,
  onViewportChange,
  onHover,
  onClick,
  onLoad,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false)

  const [resizeListener, sizes] = useResizeAware()

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
  const prev = usePrevious({ hoveredId, selectedIds })

  /**
   * Sets the feature state for rendering styles
   * @param {string} featureId
   * @param {object} state
   */
  const setFeatureState = (featureId, state) => {
    if (!loaded) {
      return
    }
    const layer = layers.find(
      l => l.hasFeatureId && l.hasFeatureId(featureId)
    )
    if (!layer || !featureId || !mapRef.current) {
      return
    }
    const id =
      idMap && idMap[featureId] ? idMap[featureId] : featureId
    currentMap &&
      currentMap.setFeatureState &&
      currentMap.setFeatureState(
        {
          source: layer.style.get('source'),
          sourceLayer: layer.style.get('source-layer'),
          id
        },
        state
      )
  }

  // update map style layers when layers change
  const mapStyle = useMemo(
    () => getUpdatedMapStyle(style, layers),
    [style, layers]
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
        positionOptions: { enableHighAccuracy: true },
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

  // handler for viewport change
  const handleViewportChange = vp => {
    if (!loaded) return
    if (vp.zoom && vp.zoom < 2) return
    const newVp = { ...vp, ...getContainerSize(mapEl.current) }
    if (!isSameViewport(viewport, newVp)) {
      return onViewportChange({
        ...vp,
        ...getContainerSize(mapEl.current)
      })
    }
  }

  // handler for feature hover
  const handleHover = ({ features, point, srcEvent }) => {
    const newHoveredFeature =
      features && features.length > 0 ? features[0] : null
    const coords =
      srcEvent && srcEvent.pageX && srcEvent.pageY
        ? {
            x: Math.round(srcEvent.pageX),
            y: Math.round(srcEvent.pageY)
          }
        : { x: null, y: null }
    onHover(newHoveredFeature, coords)
  }

  // handler for feature click
  const handleClick = ({ features }) =>
    features && features.length > 0 && onClick(features[0])

  useEffect(() => {
    onViewportChange({
      width: sizes.width,
      height: sizes.height
    })
  }, [sizes, onViewportChange])

  // set hovered outline when hoveredId changes
  useEffect(() => {
    prev &&
      prev.hoveredId &&
      setFeatureState(prev.hoveredId, { hover: false })
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
        handleHover({ features: null, point: [null, null] })
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
        {children}
        <div className="map__zoom">
          <NavigationControl
            showCompass={false}
            onViewportChange={handleViewportChange}
          />
          <ZoomToUSControl title="Zoom to U.S." />
        </div>
      </ReactMapGL>
    </div>
  )
}

MapBase.propTypes = {
  style: PropTypes.object,
  viewport: PropTypes.object,
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

export default MapBase
