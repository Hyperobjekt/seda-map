import React from 'react'
import PropTypes from 'prop-types'
import { getGaps } from '../app/selectors'
import { useDemographic } from '../app/hooks'
import SedaMenu from './SedaMenu'

const SedaGapSelect = ({ onSelect, ...props }) => {
  const demographics = getGaps().map(d => d.id)
  const [demographic, setDemographic] = useDemographic()
  const handleClick = demId => {
    if (demographic !== demId) {
      setDemographic(demId)
      onSelect && onSelect(demId)
    }
  }

  return (
    <SedaMenu value={demographic} items={demographics} onClick={handleClick} {...props}/>
  )
}

SedaGapSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaGapSelect
