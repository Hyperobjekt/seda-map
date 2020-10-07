import useMapStore from './useMapStore'

export default function useFlyToLatLon() {
  return useMapStore(state => state.flyToLatLon)
}
