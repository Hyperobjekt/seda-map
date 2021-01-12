import React from 'react'
import PropTypes from 'prop-types'
import { getDemographics } from '../app/selectors'
import { useDemographic } from '../app/hooks'
import SedaMenu from './SedaMenu'

const SedaSubgroupSelect = ({ onSelect, ...props }) => {
  const demographics = getDemographics().map(d => d.id)
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
