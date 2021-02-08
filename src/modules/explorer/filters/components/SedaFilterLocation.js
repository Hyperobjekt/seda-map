import React, { useCallback } from 'react'
import useFilterStore, {
  getFilterIndex,
  getFilterValue
} from '../../../filters/useFilterStore'
import { getPrefixLang } from '../../app/selectors/lang'
import { useRegion } from '../../app/hooks'
import useActiveFilters from '../hooks/useActiveFilters'
import { getIndiciesForSearch } from '../selectors'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { useLocationName } from '../../location'
import { getPropFromHit } from '../../search/selectors'
import { SedaSearch } from '../../search'

const SedaFilterLocation = props => {
  // grab filters array
  const filters = useActiveFilters()
  // function to remove a single filter
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  // get active demographic
  const [region] = useRegion()
  // indices for search
  const indicies = getIndiciesForSearch(region)
  // function to get location name
  const locationId = getFilterValue(filters, [
    'startsWith',
    'id'
  ])
  const locationName = useLocationName(locationId)

  /**
   * Clear the current filter and remove the selected location
   */
  const handleLocationClear = useCallback(() => {
    const index = getFilterIndex(filters, ['startsWith', 'id'])
    index > -1 && removeFilter(filters[index])
    //fire analytics event
    window.dataLayer.push({event: 'geoSelected', geoSelection: 'the us' })
  }, [filters, removeFilter])

  /**
   * Update the "startsWith" filter for places that start with
   * the given ID.
   * @param {*} id identifier for location
   * @param {*} hit selection from AlgoliaSearch component
   */
  const handleLocationSelect = (e, hit) => {
    const id = getPropFromHit(hit, 'id')
    setFilter(['startsWith', 'id', id])
    //fire analytics event
    window.dataLayer.push({event: 'geoSelected', geoSelection: hit.suggestionValue })
}

  return (
    <PanelListItem
      title={getPrefixLang('location', 'FILTER_LABEL', {
        region
      })}
      {...props}>
      <SedaSearch
        inputProps={{
          disabled: Boolean(locationName)
        }}
        value={locationName}
        hideSuggestions={Boolean(locationName)}
        placeholder={getPrefixLang(region, 'FILTER_PLACEHOLDER')}
        indices={indicies}
        activateSelection={false}
        onSelect={handleLocationSelect}
        onClear={handleLocationClear}
        clearOnSelected={false}
      />
    </PanelListItem>
  )
}

SedaFilterLocation.propTypes = {}

export default SedaFilterLocation
