import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import clsx from 'clsx'
import { getRegions } from '../../selectors'
import { useRegion } from '../../hooks'
import { SidePanelList } from '../../../../../shared'

const SedaRegionSelect = ({ onSelect, ...props }) => {
  const [region, setRegion] = useRegion()

  const regions = getRegions()

  const handleClick = regionId => {
    if (region !== regionId) {
      setRegion(regionId)
      onSelect && onSelect(regionId)
    }
  }

  return (
    <SidePanelList aria-label="region selection" {...props}>
      {regions.map((m, i) => {
        return (
          <ListItem
            className={clsx({
              'MuiListItem--active': m.id === region
            })}
            button
            key={m.id}
            onClick={() => handleClick(m.id)}>
            <ListItemText primary={m.label} />
          </ListItem>
        )
      })}
    </SidePanelList>
  )
}

SedaRegionSelect.propTypes = {
  onSelect: PropTypes.func
}

export default SedaRegionSelect
