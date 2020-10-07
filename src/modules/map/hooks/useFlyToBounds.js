import useMapStore from './useMapStore'

export default function useFlyToBounds() {
  return useMapStore(state => state.flyToBounds)
}
