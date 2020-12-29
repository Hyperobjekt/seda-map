import React, { useCallback } from 'react'
import useFilterStore from '../../../filters'
import { DEFAULT_RANGES } from '../../app/constants/metrics'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { NumberSlider } from '../../../../shared'
import { hasFilterRule } from '../../../filters/useFilterStore'
import { useRegion } from '../../app/hooks'
import { getPrefixLang } from '../../app/selectors/lang'
import { useActiveFilters } from '..'

const SedaLimitSlider = props => {
  // grab filters array
  const filters = useActiveFilters()
  // function to remove a single filter
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  const [region] = useRegion()
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  // function to set (add or update) multiple filters
  const setFilters = useFilterStore(state => state.setFilters)

  // get limit filter from filters array, or set to default for region
  const limitValue =
    filters.reduce(
      (val, f) => (f[0] === 'limit' ? f[1] : val),
      false
    ) || DEFAULT_RANGES[region]['limit']

  const min = 10
  const max = DEFAULT_RANGES[region]['limit']
  const step = 10

  // handler for when the limit filter changes
  // memoize handler to prevent constant re-renders of slider component
  const handleLimitChange = useCallback(
    (event, value) => {
      value = parseInt(value)
      // if set to a default value then clear the filter
      if (value === DEFAULT_RANGES[region]['limit']) {
        removeFilter(['limit'], true)
      } else {
        const hasLimit = hasFilterRule(filters, ['limit'])
        // if limit rule doesn't already exist, add the sorting rule so it limts by size
        hasLimit
          ? setFilter(['limit', value])
          : setFilters(
              [['limit', value], ['sort', 'sz', 'asc']],
              true
            )
      }
    },
    [region, filters, setFilter, setFilters, removeFilter]
  )

  return (
    <PanelListItem
      title={getPrefixLang('size', 'FILTER_LABEL')}
      titleProps={{ id: 'limit-slider' }}
      {...props}>
      <NumberSlider
        value={limitValue}
        min={min}
        max={max}
        step={step}
        aria-labelledby="limit-slider"
        SliderProps={{
          onChange: handleLimitChange
        }}
        inputProps={{
          onChange: e => handleLimitChange(e, e.target.value)
        }}
      />
    </PanelListItem>
  )
}

export default SedaLimitSlider
