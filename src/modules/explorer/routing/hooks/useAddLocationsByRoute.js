import useDataOptions from '../../app/hooks/useDataOptions'
import { parseLocationsString } from '../selectors'

export default () => {
  const addLocations = useDataOptions(
    state => state.addLocations
  )
  return async (route, setActive = true) => {
    const locations = parseLocationsString(route).map(l => l.id)
    addLocations(locations, setActive)
    return locations
  }
}
