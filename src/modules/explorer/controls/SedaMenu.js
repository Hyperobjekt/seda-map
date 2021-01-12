import React from 'react'
import SedaMenuList from './SedaMenuList'
import SedaInlineMenu from './SedaInlineMenu'

const SedaMenu = ({ type = 'list', ...props }) => {
  const Component =
    type === 'list' ? SedaMenuList : SedaInlineMenu
  return <Component {...props} />
}

export default SedaMenu
