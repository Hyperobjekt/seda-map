import { FlyToInterpolator } from 'react-map-gl'
import * as ease from 'd3-ease'

/**
 * default viewport on map view
 */
export const DEFAULT_VIEWPORT = {
  latitude: 37.39,
  longitude: -96.78,
  zoom: 3.15
}

export const DEFAULT_FLIGHT_PROPS = {
  transitionDuration: 3000,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: ease.easeCubic
}
