import React from 'react'
import PropTypes from 'prop-types'
import {
  MetricIcon,
  FilterIcon,
  RegionsIcon,
  SubgroupsIcon,
  LocationsIcon
} from '../../../icons'
import { getPrefixLang } from '../../../../shared/selectors/lang'
import useUiStore from '../../hooks/useUiStore'
import useDataOptions from '../../hooks/useDataOptions'
import SelectionButton from '../base/SelectionButton'

const SelectionIcon = ({ selectionId }) => {
  const metric = useDataOptions(state => state.metric)
  switch (selectionId) {
    case 'metric':
      return <MetricIcon metricId={metric.id} />
    case 'demographic':
      return <SubgroupsIcon />
    case 'region':
      return <RegionsIcon />
    case 'filter':
      return <FilterIcon />
    case 'location':
      return <LocationsIcon />
    default:
      return null
  }
}

const SedaSelectionButton = ({
  selectionId,
  value,
  ...props
}) => {
  const label = getPrefixLang(selectionId, 'PANEL_TITLE')
  const selection = useUiStore(state => state.selection)
  const setSelection = useUiStore(state => state.setSelection)
  return (
    <SelectionButton
      primary={label}
      secondary={value}
      icon={<SelectionIcon selectionId={selectionId} />}
      onClick={() => setSelection(selectionId)}
      {...props}
    />
  )
}

SedaSelectionButton.propTypes = {}

export default SedaSelectionButton
