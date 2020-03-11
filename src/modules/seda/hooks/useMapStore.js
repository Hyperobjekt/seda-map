import create from 'zustand'
import { FlyToInterpolator } from 'react-map-gl'
import * as ease from 'd3-ease'

import { DEFAULT_VIEWPORT } from '../../map/constants'

const [useMapStore] = create((set, get, api) => ({
  viewport: DEFAULT_VIEWPORT,
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport }
    })),
  flyToBounds: bounds => {},
  flyToCoords: (coords, zoom) => {},
  flyToState: stateId => {},
  flyToUnitedStates: () => {
    set(state => ({
      viewport: {
        ...state.viewport,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic
      }
    }))
  }
}))

export default useMapStore
