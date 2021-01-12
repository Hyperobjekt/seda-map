import React from 'react'
import { getPrefixLang } from '../app/selectors/lang'
import { List, ListItem, ListItemText } from '@material-ui/core'

const MenuItem = ({ children, ...props }) => (
  <ListItem button {...props}>
    <ListItemText primary={children} />
  </ListItem>
)

const SedaMenuList = ({
  value,
  items,
  component: Component,
  itemComponent: ItemComponent,
  ItemProps,
  langPrefix,
  onSelect,
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
            onClick={e => onSelect && onSelect(item, e)}
            {...ItemProps}>
            {getPrefixLang(item, langPrefix)}
          </ItemComponent>
        )
      })}
    </Component>
  )
}

SedaMenuList.defaultProps = {
  langPrefix: 'LABEL',
  component: List,
  itemComponent: MenuItem,
  ItemProps: {}
}

SedaMenuList.propTypes = {}

export default SedaMenuList
