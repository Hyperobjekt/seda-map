import create from 'zustand'
import { DEFAULT_VIEWPORT } from '../../map/constants'

const [useMapStore] = create(set => ({
  viewport: DEFAULT_VIEWPORT,
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport }
    }))
}))

export default useMapStore
