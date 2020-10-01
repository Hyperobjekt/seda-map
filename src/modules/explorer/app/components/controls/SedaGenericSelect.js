import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeId } from '../../../../../shared/utils'
import { LinkButton } from '../../../../../shared'
import { getPrefixLang } from '../../selectors/lang'

export default function SedaGenericSelect({
  items,
  ButtonComponent = LinkButton,
  getLabel = getPrefixLang,
  onSelect,
  children,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null)

  const [id] = useState(makeId())

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = e => {
    onSelect && onSelect(e)
    handleClose()
  }

  return (
    <div {...props}>
      (
      <ButtonComponent
        aria-controls={id}
        aria-haspopup="true"
        onClick={handleClick}>
        {children}
      </ButtonComponent>
      )
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {items.map(item => (
          <MenuItem
            key={item}
            onClick={e => handleSelect(item, e)}>
            {getLabel(item)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
