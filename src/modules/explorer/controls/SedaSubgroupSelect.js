import React from 'react'
import PropTypes from 'prop-types'
import { useDemographic, useRegion } from '../app/hooks'
import SedaMenu from './SedaMenu'
import { getDemographicsForRegion } from '../app/selectors/demographics'

const SedaSubgroupSelect = ({ onSelect, ...props }) => {
  const [region] = useRegion()
  const demographics = getDemographicsForRegion(region)
  const [demographic, setDemographic] = useDemographic()
  const handleClick = demId => {
    if (demographic !== demId) {
      setDemographic(demId)
      onSelect && onSelect(demId)
    }
  }

  return (
    <SedaMenu
      value={demographic}
      items={demographics}
      onSelect={handleClick}
      {...props}
    />
  )
}

SedaSubgroupSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaSubgroupSelect
