import React from 'react'
import { getLang } from '../../app/selectors/lang'
import { SedaSearch } from '../../search'
import useAddCompareLocations from '../hooks/useAddCompareLocations'

const CompareSearch = ({ ...props }) => {
  const addCompareLocations = useAddCompareLocations()

  const handleLocationSelect = (e, hit) => {
    console.log('selected location', hit)
    addCompareLocations([hit.suggestion?.id])
  }

  return (
    <SedaSearch
      indices={['states', 'counties', 'districts', 'schools']}
      placeholder={getLang('LOCATIONS_SEARCH')}
      activateSelection={false}
      flyToSelection={false}
      onSelect={handleLocationSelect}
      {...props}
    />
  )
}

export default CompareSearch
