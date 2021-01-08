import React from 'react'
import { getLang } from '../../app/selectors/lang'
import { SedaSearch } from '../../search'
import useAddCompareLocations from '../hooks/useAddCompareLocations'

const CompareSearch = ({...props}) => {

  const addCompareLocations = useAddCompareLocations()

  const handleLocationSelect = (location) => {
    console.log('selected location', location)
    addCompareLocations([location.id])
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
