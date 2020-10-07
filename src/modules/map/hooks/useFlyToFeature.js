import useMapStore from './useMapStore'

export default function useFlyToFeature() {
  return useMapStore(state => state.flyToFeature)
}
