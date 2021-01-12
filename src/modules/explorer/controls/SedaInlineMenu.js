import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SedaMenu from './SedaMenu'
import { makeId } from '../../../shared/utils'
import { getPrefixLang } from '../app/selectors/lang'
import { LinkButton } from '../../../shared'

/**
 * A basic select menu
 */
export default function SedaInlineMenu({
  ButtonComponent,
  value,
  langPrefix,
  onSelect,
  ButtonProps,
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
  const handleSelect = (item, e) => {
    onSelect && onSelect(item, e)
    handleClose()
  }

  return (
    <>
      <ButtonComponent
        aria-controls={id}
        aria-haspopup="true"
        onClick={handleClick}
        {...ButtonProps}>
        {getPrefixLang(value, langPrefix)}
      </ButtonComponent>
      <SedaMenu
        component={Menu}
        itemComponent={MenuItem}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        value={value}
        onSelect={handleSelect}
        onClose={handleClose}
        {...props}
      />
    </>
  )
}

SedaInlineMenu.defaultProps = {
  ButtonComponent: LinkButton,
  ButtonProps: {},
  langPrefix: 'LABEL'
}

SedaInlineMenu.propTypes = {
  /** React element to use for the button (default: LinkButton) */
  ButtonComponent: PropTypes.element,
  /** Function that accepts the menu item and returns a label */
  getLabel: PropTypes.func
}
