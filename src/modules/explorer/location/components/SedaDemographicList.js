import React from 'react'
import PropTypes from 'prop-types'
import { ListSubheader } from '@material-ui/core'
import SedaDemographicListItem from './SedaDemographicListItem'
import { useDemographic } from '../../app/hooks'
import { max } from 'd3-array'

const SedaDemographicList = ({
  title,
  subgroups,
  metric,
  location,
  breaks
}) => {
  const [demographic, setDemographic] = useDemographic()

  const handleDemographicSelect = dem => {
    setDemographic(dem)
  }

  // do not render anything if there are no subgroups
  if (subgroups.length === 0) return null

  const maxValue = max(
    subgroups
      .map(sg => Math.abs(location[sg + '_' + metric]))
      .filter(v => !!v)
  )

  return (
    <>
      <ListSubheader>{title}</ListSubheader>
      {subgroups.map(subgroup => {
        const varName = subgroup + '_' + metric
        return (
          <SedaDemographicListItem
            key={subgroup}
            varName={varName}
            value={location[varName]}
            maxValue={maxValue}
            interval={location[varName + '_e']}
            selected={subgroup === demographic}
            divider={breaks.indexOf(subgroup) > -1}
            button
            onClick={() => handleDemographicSelect(subgroup)}
          />
        )
      })}
    </>
  )
}

SedaDemographicList.defaultProps = {
  breaks: [],
  subgroups: []
}

SedaDemographicList.propTypes = {}

export default SedaDemographicList
