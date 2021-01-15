import React from 'react'
import { ListSubheader } from '@material-ui/core'
import SedaDemographicListItem from './SedaDemographicListItem'
import { useDemographic } from '../../app/hooks'
import { max } from 'd3-array'
import { isGapDemographic } from '../../app/selectors'

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

  const values = subgroups
    .filter(sg => !!location[sg + '_' + metric])
    .map(sg => {
      // learning rates (`grd`) need offset from 1
      if (metric === 'grd' && !isGapDemographic(sg))
        return Math.abs(location[sg + '_' + metric] - 1)
      return Math.abs(location[sg + '_' + metric])
    })

  const maxValue = max(values)

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
