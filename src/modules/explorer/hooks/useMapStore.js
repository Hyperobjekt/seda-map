import create from 'zustand'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import bbox from '@turf/bbox'

import { DEFAULT_VIEWPORT } from '../../map/constants'
import { getStateViewportByFips } from '../../../shared/selectors/states'

const getViewportForBounds = (
  bounds,
  baseViewport,
  options = {}
) => {
  const width = baseViewport.width || 400
  const height = baseViewport.height || 300
  const padding = options.padding || 20
  const vp = new WebMercatorViewport({
    width,
    height
  }).fitBounds(bounds, { padding })
  return {
    ...baseViewport,
    ...vp
  }
}

const [useMapStore] = create((set, get, api) => ({
  viewport: DEFAULT_VIEWPORT,
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport }
    })),
  flyToFeature: feature => {
    const featureBbox = bbox(feature)
    const bounds = [
      [featureBbox[0], featureBbox[1]],
      [featureBbox[2], featureBbox[3]]
    ]
    set(state => ({
      viewport: {
        ...getViewportForBounds(bounds, state.viewport),
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      }
    }))
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
  }
}))

export default useMapStore
