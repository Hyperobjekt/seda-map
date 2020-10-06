import React from 'react'
import IndicatorIcon from '../../../../../shared/components/Icons/IndicatorIcon'
import { FilterIcon } from '../../../../icons'
import { useActiveFilters } from '../../../filters'
import SedaPanelButton from './SedaPanelButton'

export default function SedaFilterPanelButton(props) {
  const activeFilters = useActiveFilters()
  return (
    <SedaPanelButton
      panelId="filter"
      secondary={activeFilters.length + ' active filters'}
      icon={
        <IndicatorIcon indicator={activeFilters.length}>
          <FilterIcon />
        </IndicatorIcon>
      }
      {...props}
    />
  )
}
