import create from 'zustand'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import bbox from '@turf/bbox'

import { DEFAULT_VIEWPORT } from '../../map/constants'
import { getStateViewportByFips } from '../../../shared/selectors/states'
import {
  getRegionFromLocationId,
  getFeatureProperty
} from '../../../shared/selectors'
import {
  isEmptyRoute,
  isValidExplorerRoute,
  getParamsFromPathname
} from '../../../shared/selectors/router'

const getZoomLevelForFeature = feature => {
  const id = getFeatureProperty(feature, 'id')
  if (!id) return 9
  const region = getRegionFromLocationId(id)
  switch (region) {
    case 'states':
      return 3
    case 'counties':
      return 6
    case 'districts':
      return 9
    case 'cities':
      return 12
    case 'schools':
      return 14
    default:
      return 9
  }
}

const getFeatureGeometryType = feature => {
  if (!feature.geometry || !feature.geometry.type) return null
  return feature.geometry.type
}

const getViewportForFeature = (feature, initialViewport) => {
  const type = getFeatureGeometryType(feature)
  if (!type) return {}
  if (type === 'Point') {
    const [longitude, latitude] = feature.geometry.coordinates
    const zoom = getZoomLevelForFeature(feature)
    return {
      latitude,
      longitude,
      zoom
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

const [useMapStore] = create((set, get, api) => ({
  loaded: false,
  viewport: DEFAULT_VIEWPORT,
  idMap: {},
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport }
    })),
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
        ...DEFAULT_VIEWPORT,
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

export default useMapStore
