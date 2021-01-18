import React, { useCallback } from 'react'
import useFilterStore, {
  getFilterValue
} from '../../../filters/useFilterStore'
import { useActiveOptions } from '../../app/hooks'
import { DEFAULT_RANGES } from '../../app/constants/metrics'
import shallow from 'zustand/shallow'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { DebouncedSlider as Slider } from '../../../../shared'
import { getPrefixLang } from '../../app/selectors/lang'
import { getFormatterForVarName } from '../../app/selectors'
import useActiveFilters from '../hooks/useActiveFilters'

const getDefaultValue = (region, metric) => {
  const vals = DEFAULT_RANGES[region]
  if (!vals || !vals[metric]) return [-1, 1]
  return vals[metric]
}

const SedaMetricSlider = ({ metricId, ...props }) => {
  // grab filters array
  const filters = useActiveFilters()
  // function to remove a single filter
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  const [, demographic, region] = useActiveOptions()
  const varName = [demographic, metricId].join('_')
  const value = getFilterValue(filters, ['range', metricId])
  const defaultValue = getDefaultValue(region, metricId)
  const min = defaultValue[0]
  const max = defaultValue[1]
  const step = (max - min) / 20
  const formatter = getFormatterForVarName(varName)
  const handleSliderChange = useCallback(
    (event, value) => {
      value = value.map(v => parseFloat(v))
      // if set to a default value then clear the filter
      shallow(defaultValue, value)
        ? removeFilter(['range', metricId], true)
        : setFilter(['range', metricId, value])
    },
    [setFilter, removeFilter, defaultValue, metricId]
  )
  return (
    <PanelListItem
      title={getPrefixLang(metricId, 'FILTER_LABEL')}
      titleProps={{ id: metricId + '-slider' }}
      {...props}>
      <Slider
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        onChange={handleSliderChange}
        valueLabelDisplay="on"
        aria-labelledby={metricId + '-slider'}
        getAriaValueText={formatter}
        valueLabelFormat={formatter}
      />
    </PanelListItem>
  )
}

SedaMetricSlider.propTypes = {}

export default SedaMetricSlider
