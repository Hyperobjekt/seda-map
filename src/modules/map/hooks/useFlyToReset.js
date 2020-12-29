import useMapStore from './useMapStore'

export default function useFlyToReset() {
  return useMapStore(state => state.flyToReset)
}
