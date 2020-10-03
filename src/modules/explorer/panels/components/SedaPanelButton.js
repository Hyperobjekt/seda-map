import React from 'react'
import PropTypes from 'prop-types'
import {
  MetricIcon,
  FilterIcon,
  RegionsIcon,
  SubgroupsIcon,
  LocationsIcon
} from '../../../icons'
import { getPrefixLang } from '../../app/selectors/lang'
import { useMetric } from '../../app/hooks'
import { SelectionButton } from '../../../../shared'
import useActivePanel from '../hooks/useActivePanel'

const SelectionIcon = ({ selectionId }) => {
  const [metric] = useMetric()
  switch (selectionId) {
    case 'metric':
      return <MetricIcon metricId={metric} />
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

/**
 * Button used for options in the full panel view
 */
const SedaSelectionButton = ({
  selectionId,
  value,
  ...props
}) => {
  const label = getPrefixLang(selectionId, 'PANEL_TITLE')
  const [, setSelection] = useActivePanel()
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

SedaSelectionButton.propTypes = {
  /** identifier for what type of selection the button is for */
  selectionId: PropTypes.string,
  /** current value of the selection */
  value: PropTypes.string
}

export default SedaSelectionButton