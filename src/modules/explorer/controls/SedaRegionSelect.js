import React from 'react'
import PropTypes from 'prop-types'
import { getRegions } from '../app/selectors'
import { useRegion } from '../app/hooks'
import SedaMenu from './SedaMenu'

const SedaRegionSelect = ({ onSelect, ...props }) => {
  const [region, setRegion] = useRegion()

  const regions = getRegions().map(r => r.id)

  const handleSelect = regionId => {
    if (region !== regionId) {
      setRegion(regionId)
      onSelect && onSelect(regionId)
    }
  }

  return (
    <SedaMenu
      value={region}
      items={regions}
      onSelect={handleSelect}
      {...props}
    />
  )
}

SedaRegionSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaRegionSelect
