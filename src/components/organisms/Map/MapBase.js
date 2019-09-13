import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMapGL, { NavigationControl, GeolocateControl } from 'react-map-gl';
import PropTypes from 'prop-types';
import usePrevious from '../../../hooks/usePrevious';

/**
 * Returns the width and height of the provided element
 */
const getContainerSize = (el) => {
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
const getInteractiveLayerIds = (layers) => layers
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
    layers.reduce((newLayers, layer) =>
      newLayers.splice(layer.z, 0, layer.style)
    , style.get('layers'))
  );
}

const MapBase = ({
  style, 
  hoveredId, 
  selectedIds, 
  layers = [], 
  viewport = {}, 
  children,
  idMap,
  selectedColors = [ '#00ff00' ],
  ariaLabel,
  onViewportChange,
  onHover,
  onClick,
  onLoad,
  ...rest
}) => {

  const [loaded, setLoaded] = useState(false);

  // reference to map container DOM element
  const mapEl = useRef(null);

  // refernce to the ReactMapGL instance
  const mapRef = useRef(null);

  // canvase element
  const canvas = mapRef && 
    mapRef.current && 
    mapRef.current.getMap && 
    mapRef.current.getMap().getCanvas();

  // storing previous hover / selected IDs
  const prev = usePrevious({hoveredId, selectedIds});

  /**
   * Sets the feature state for rendering styles
   * @param {string} featureId 
   * @param {object} state 
   */
  const setFeatureState = (featureId, state) => {
    if (!loaded) { return; }
    const layer = 
      layers.find(l => l.hasFeatureId && l.hasFeatureId(featureId))
    if (!layer || !featureId || !mapRef.current) { return; }
    const id = layer.idMap && idMap && idMap[featureId] ? 
      idMap[featureId] : featureId
    mapRef.current.getMap().setFeatureState({
      source: layer.style.get('source'), 
      sourceLayer: layer.style.get('source-layer'), 
      id
    }, state);
  }

  // update map style layers when layers change
  const mapStyle = useMemo(() => 
    getUpdatedMapStyle(style, layers),
    [ style, layers ]
  );

  // update list of interactive layer ids when layers change
  const interactiveLayerIds = useMemo(() => 
    getInteractiveLayerIds(layers), 
    [ layers ]
  );

  useEffect(() => {
    if (canvas) {
      canvas.setAttribute('aria-label', ariaLabel)
    }
  }, [ ariaLabel, canvas ])

  // handler for map load
  const handleLoad = (e) => {
    if (!loaded) {
      setLoaded(true)
      // HACK: remove tabindex from map div
      document.querySelector('.map:first-child')
        .children[0].removeAttribute('tabindex');
      // add screen reader content for map
      const canvas = mapRef.current.getMap().getCanvas();
      canvas.setAttribute('role', 'img')
      canvas.setAttribute('aria-label', ariaLabel)
      if(typeof onLoad === 'function') { onLoad(e) }
    }
  }

  // handler for viewport change
  const handleViewportChange = (vp) => {
    if (!loaded) return;
    if (vp.zoom && vp.zoom < 2) return;
    return onViewportChange({ ...vp, ...getContainerSize(mapEl.current) })
  }

  // handler for feature hover
  const handleHover = ({ features, point, srcEvent }) => {
    const newHoveredFeature = 
      features && features.length > 0 ? features[0] : null
    const coords = srcEvent && srcEvent.pageX && srcEvent.pageY ?
      { 
        x: Math.round(srcEvent.pageX), 
        y: Math.round(srcEvent.pageY) 
      } : { x: null, y: null }
    onHover(newHoveredFeature, coords)
  }

  // handler for feature click
  const handleClick = ({ features }) =>
    features && features.length > 0 && onClick(features[0])

  // resize map on window resize
  useEffect(() => {
    // handler for resize event
    const handleResize = () => {
      onViewportChange({...getContainerSize(mapEl.current)}, false);
    }
    window.addEventListener('resize', handleResize);
    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  }, [ onViewportChange ]);

  // set hovered outline when hoveredId changes
  useEffect(() => {
    prev && prev.hoveredId && 
      setFeatureState(prev.hoveredId, { hover: false });
    hoveredId &&
      setFeatureState(hoveredId, { hover: true });
  // eslint-disable-next-line
  }, [ hoveredId, loaded ]) // update only when hovered id changes

  // set selected outlines when selected IDs change
  useEffect(() => {
    prev && prev.selectedIds && prev.selectedIds.forEach(id =>
      setFeatureState(id, { selected: false })
    )
    selectedIds.forEach((id, i) => 
      setFeatureState(id, { selected: selectedColors[i % selectedColors.length] })
    )
  // eslint-disable-next-line
  }, [ selectedIds, loaded ]) // update only when selected ids change

  return (
    <div 
      className="map"
      ref={mapEl}
      onMouseLeave={() => handleHover({features: null, point: [null, null]})}
    >
      <ReactMapGL
        ref={mapRef}
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
        { ...viewport }
        { ...rest }
      >
        { children }
        <div className="map__zoom">
          <NavigationControl showCompass={false} onViewportChange={handleViewportChange} />
          <GeolocateControl positionOptions={{enableHighAccuracy: true}} />
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
  onLoad: PropTypes.func,
}

export default MapBase;