import React from 'react'
import IndicatorIcon from '../../../../../shared/components/Icons/IndicatorIcon'
import { FilterIcon } from '../../../../icons'
import { useActiveFilters } from '../../../filters'
import SedaPanelButton from './SedaPanelButton'

export default function SedaFilterPanelButton(props) {
  const activeFilters = useActiveFilters()
  // do not include sort in the filter count, as it doesn't filter any data
  const filterCount = activeFilters.filter(f => f[0] !== 'sort')
    .length
  return (
    <SedaPanelButton
      panelId="filter"
      secondary={filterCount + ' active filters'}
      icon={
        <IndicatorIcon indicator={filterCount}>
          <FilterIcon />
        </IndicatorIcon>
      }
      {...props}
    />
  )
}
