import create from 'zustand'
import WebMercatorViewport from 'viewport-mercator-project'
import bbox from '@turf/bbox'

import {
  DEFAULT_VIEWPORT,
  DEFAULT_FLIGHT_PROPS
} from '../constants'
import { getStateViewportByFips } from '../utils'

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
  resetViewport: { ...DEFAULT_VIEWPORT },
  viewport: DEFAULT_VIEWPORT,
  setViewport: viewport => {
    set(state => {
      const newViewport = {
        ...state.viewport,
        ...viewport
      }
      return {
        viewport: newViewport
      }
    })
  },

  setResetViewport: resetViewport => set({ resetViewport }),
  setLoaded: loaded => set({ loaded }),
  flyToFeature: feature => {
    const viewport = {
      ...getViewportForFeature(feature, get().viewport),
      ...DEFAULT_FLIGHT_PROPS
    }
    set({ viewport })
  },
  flyToBounds: bounds => {
    set(state => ({
      viewport: {
        ...getViewportForBounds(bounds, state.viewport),
        ...DEFAULT_FLIGHT_PROPS
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
        ...DEFAULT_FLIGHT_PROPS
      }
    }))
  },
  flyToViewport: vp => {
    set(state => ({
      viewport: {
        ...state.viewport,
        ...vp,
        ...DEFAULT_FLIGHT_PROPS
      }
    }))
  },
  flyToState: stateId => {
    set(state => ({
      viewport: {
        ...state.viewport,
        ...getStateViewportByFips(stateId, state.viewport),
        ...DEFAULT_FLIGHT_PROPS
      }
    }))
  },
  flyToReset: () => {
    set(state => {
      const newViewport = {
        ...state.viewport,
        ...state.resetViewport,
        ...DEFAULT_FLIGHT_PROPS
      }
      return { viewport: newViewport }
    })
  }
}))

export default useMapStore
