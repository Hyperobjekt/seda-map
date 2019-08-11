import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMapGL, { NavigationControl } from 'react-map-gl';
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
  onViewportChange,
  onHover,
  onClick,
  ...rest
}) => {

  const [loaded, setLoaded] = useState(false);

  // reference to map container DOM element
  const mapEl = useRef(null);

  // refernce to the ReactMapGL instance
  const mapRef = useRef(null);

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
    [ layers ]
  );

  // update list of interactive layer ids when layers change
  const interactiveLayerIds = useMemo(() => 
    getInteractiveLayerIds(layers), 
    [ layers ]
  );

  // handler for viewport change
  const handleViewportChange = (vp) => 
    onViewportChange({ ...vp, ...getContainerSize(mapEl.current) })

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

  // handler for resize event
  const handleResize = () => {
    onViewportChange({...viewport, ...getContainerSize(mapEl.current)}, false);
  }

  // resize map on window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // set hovered outline when hoveredId changes
  useEffect(() => {
    prev && prev.hoveredId && 
      setFeatureState(prev.hoveredId, { hover: false });
    hoveredId &&
      setFeatureState(hoveredId, { hover: true });
  }, [ hoveredId, loaded ])

  // set selected outlines when selected IDs change
  useEffect(() => {
    prev && prev.selectedIds && prev.selectedIds.forEach(id =>
      setFeatureState(id, { selected: false })
    )
    selectedIds.forEach((id, i) => 
      setFeatureState(id, { selected: selectedColors[i % selectedColors.length] })
    )
  }, [ selectedIds, loaded ])

  return (
    <div 
      className="map"
      ref={mapEl}
      onMouseLeave={() => handleHover({features: null, point: [null, null]})}
    >
      <ReactMapGL
        ref={mapRef}
        mapStyle={mapStyle}
        onLoad={() => setLoaded(true)}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={handleViewportChange}
        onHover={handleHover}
        onClick={handleClick}
        { ...viewport }
        { ...rest }
      >
        { children }
        <div className="map__zoom">
          <NavigationControl onViewportChange={handleViewportChange} />
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
}

export default MapBase;