import React from 'react'
import PropTypes from 'prop-types'
import useSchoolFlags from '../../app/hooks/useSchoolFlags'

const SedaLocationFlags = ({locationId, ...props}) => {
  const flags = useSchoolFlags()
  const locationFlags = ['sped', 'lep', 'gifted'].filter((flagType, i) => flags[i].indexOf(locationId) > -1)
  return (
    <div>
      { locationFlags.join(',')}
    </div>
  )
}

SedaLocationFlags.propTypes = {

}

export default SedaLocationFlags
