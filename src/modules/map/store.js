import create from 'zustand'
import shallow from 'zustand/shallow'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import bbox from '@turf/bbox'

import { DEFAULT_VIEWPORT } from './constants'
import { getStateViewportByFips } from './utils'

const getFeatureGeometryType = feature => {
  if (!feature.geometry || !feature.geometry.type) return null
  return feature.geometry.type
}

const getViewportForFeature = (feature, initialViewport) => {
  const type = getFeatureGeometryType(feature)
  if (!type) return {}
  if (type === 'Point') {
    const [longitude, latitude] = feature.geometry.coordinates
    return {
      latitude,
      longitude,
      zoom: 14
    }
  }
  const featureBbox = bbox(feature)
  const bounds = [
    [featureBbox[0], featureBbox[1]],
    [featureBbox[2], featureBbox[3]]
  ]
  return getViewportForBounds(bounds, initialViewport)
}

const getViewportForBounds = (
  bounds,
  baseViewport,
  options = {}
) => {
  const width = baseViewport.width
  const height = baseViewport.height
  const padding = options.padding || 20
  const vp = new WebMercatorViewport({
    width,
    height
  }).fitBounds(bounds, { padding })
  return {
    ...baseViewport,
    latitude: vp.latitude,
    longitude: vp.longitude,
    zoom: vp.zoom
  }
}

const [useMapStore] = create((set, get) => ({
  loaded: false,
  resetViewport: DEFAULT_VIEWPORT,
  viewport: DEFAULT_VIEWPORT,
  idMap: {},
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport }
    })),
  setResetViewport: resetViewport => set({ resetViewport }),
  setLoaded: loaded => set({ loaded }),
  addToIdMap: (featureId, locationId) => {
    if (get().idMap.hasOwnProperty(featureId)) return
    set(state => ({
      idMap: {
        ...state.idMap,
        [locationId]: featureId
      }
    }))
  },
  flyToFeature: feature => {
    const viewport = {
      ...getViewportForFeature(feature, get().viewport),
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: ease.easeCubic
    }
    set(state => ({ viewport }))
  },
  flyToBounds: bounds => {
    set(state => ({
      viewport: {
        ...getViewportForBounds(bounds, state.viewport),
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      }
    }))
  },
  flyToLatLon: (lat, lon, zoom) => {
    set(state => ({
      viewport: {
        ...state.viewport,
        latitude: lat,
        longitude: lon,
        zoom: zoom,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      }
    }))
  },
  flyToState: stateId => {
    set(state => ({
      viewport: {
        ...state.viewport,
        ...getStateViewportByFips(stateId, state.viewport),
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      }
    }))
  },
  flyToReset: () => {
    set(state => ({
      viewport: {
        ...state.viewport,
        ...state.resetViewport,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      }
    }))
  },
  setViewportFromRoute: params => {
    set(state => ({
      viewport: {
        ...state.viewport,
        zoom: params.zoom,
        latitude: params.lat,
        longitude: params.lon
      }
    }))
  }
}))

/**
 * Provides pixel dimensions of the map viewport
 * @returns {[number, number]} [width, height]
 */
export const useMapSize = () => {
  return useMapStore(
    state => [state.viewport.width, state.viewport.height],
    shallow
  )
}

/**
 * Provides map viewport value and setter
 * @returns {[object, function]} [viewport, setViewport]
 */
export const useMapViewport = () => {
  return useMapStore(
    state => [state.viewport, state.setViewport],
    shallow
  )
}

/**
 * Returns an ID map from feature ID to location ID
 * and method for adding id's to the map
 */
export const useIdMap = () => {
  return useMapStore(
    state => [state.idMap, state.addToIdMap],
    shallow
  )
}

export const useFlyToState = () => {
  return useMapStore(state => state.flyToState)
}

export const useFlyToFeature = () => {
  return useMapStore(state => state.flyToFeature)
}

export const useFlyToLatLon = () => {
  return useMapStore(state => state.flyToLatLon)
}

export const useFlyToReset = () => {
  return useMapStore(state => state.flyToReset)
}

export default useMapStore
