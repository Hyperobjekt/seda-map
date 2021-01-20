import React from 'react'
import clsx from 'clsx'
import {
  ListItem,
  ListItemText,
  withStyles
} from '@material-ui/core'

const listItemStyles = theme => ({
  root: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingBottom: theme.spacing(2)
  },
  title: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary
  }
})

export const PanelListItem = withStyles(listItemStyles)(
  ({
    title,
    titleProps,
    classes,
    className,
    children,
    ...props
  }) => {
    return (
      <ListItem
        className={clsx(classes.root, className)}
        {...props}>
        {title && (
          <ListItemText
            primaryTypographyProps={{
              ...titleProps,
              className: clsx(
                classes.title,
                titleProps.className
              )
            }}
            primary={title}
          />
        )}
        {children}
      </ListItem>
    )
  }
)

PanelListItem.defaultProps = {
  titleProps: {},
  classes: {}
}
