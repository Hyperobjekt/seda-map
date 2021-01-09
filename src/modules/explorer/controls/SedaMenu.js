import React from 'react'
import PropTypes from 'prop-types'
import { getPrefixLang } from '../app/selectors/lang'
import { List, ListItem, ListItemText } from '@material-ui/core'

const MenuItem = ({ children, ...props }) => (
  <ListItem button {...props}>
    <ListItemText primary={children} />
  </ListItem>
)

const SedaMenu = ({
  value,
  items,
  component: Component,
  itemComponent: ItemComponent,
  ItemProps,
  langPrefix,
  onClick,
  ...props
}) => {
  return (
    <Component {...props}>
      {items.map((item, i) => {
        return (
          <ItemComponent
            key={item}
            value={item}
            selected={item === value}
            onClick={e => onClick && onClick(item, e)}
            {...ItemProps}>
            {getPrefixLang(item, langPrefix)}
          </ItemComponent>
        )
      })}
    </Component>
  )
}

SedaMenu.defaultProps = {
  langPrefix: 'LABEL',
  component: List,
  itemComponent: MenuItem,
  ItemProps: {}
}

SedaMenu.propTypes = {}

export default SedaMenu
