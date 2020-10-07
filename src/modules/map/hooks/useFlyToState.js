import useMapStore from './useMapStore'

export default function useFlyToState() {
  return useMapStore(state => state.flyToState)
}
