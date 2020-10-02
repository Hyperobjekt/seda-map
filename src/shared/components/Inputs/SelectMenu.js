import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeId } from '../../utils'
import { LinkButton } from '../Buttons'

/**
 * A basic select menu
 */
export default function SelectMenu({
  items,
  ButtonComponent,
  getLabel,
  onSelect,
  children,
  ...props
}) {
  // anchor element for managing focus
  const [anchorEl, setAnchorEl] = useState(null)
  // unique id for menu
  const [id] = useState(makeId())
  // handler for menu button click
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  // handler for menu button close
  const handleClose = () => {
    setAnchorEl(null)
  }
  // handler for menu item select
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

SelectMenu.defaultProps = {
  ButtonComponent: LinkButton,
  getLabel: v => v
}

SelectMenu.propTypes = {
  /** React element to use for the button (default: LinkButton) */
  ButtonComponent: PropTypes.element,
  /** Function that accepts the menu item and returns a label */
  getLabel: PropTypes.func
}
