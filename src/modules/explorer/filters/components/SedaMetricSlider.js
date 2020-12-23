import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import useFilterStore, {
  getFilterValue
} from '../../../filters/useFilterStore'
import { useAppContext } from '../../app/hooks'
import { DEFAULT_RANGES } from '../../app/constants/metrics'
import shallow from 'zustand/shallow'
import { PanelListItem } from '../../../../shared/components/Panels/PanelList'
import { DebouncedSlider as Slider } from '../../../../shared'
import { getPrefixLang } from '../../app/selectors/lang'
import { getFormatterForVarName } from '../../app/selectors'
import useActiveFilters from '../hooks/useActiveFilters'

const SedaMetricSlider = ({ metricId, ...props }) => {
  // grab filters array
  const filters = useActiveFilters()
  // function to remove a single filter
  const removeFilter = useFilterStore(
    state => state.removeFilter
  )
  // function to set (add or update) single filter
  const setFilter = useFilterStore(state => state.setFilter)
  const { region, demographic } = useAppContext()
  const varName = [demographic, metricId].join('_')
  const value = getFilterValue(filters, ['range', metricId])
  const defaultValue = DEFAULT_RANGES[region][metricId]
  const min = DEFAULT_RANGES[region][metricId][0]
  const max = DEFAULT_RANGES[region][metricId][1]
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
    [region, setFilter, removeFilter]
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
