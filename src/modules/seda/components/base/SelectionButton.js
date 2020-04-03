import React from 'react'
import PropTypes from 'prop-types'
import {
  ListItemIcon,
  makeStyles,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'

import clsx from 'clsx'
import { RightIcon } from '../../../icons'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: props =>
      props.small ? theme.spacing(6) : theme.spacing(9),
    paddingLeft: theme.spacing(3),
    background: props =>
      props.active
        ? theme.app.highlightColor
        : theme.palette.background.paper
  },
  icon: {
    color: props =>
      props.active
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    '& svg': { fontSize: 32 }
  },
  text: {
    color: props => props.active && theme.palette.primary.main
  },
  secondary: {
    textTransform: 'capitalize'
  },
  secondaryAction: {
    pointerEvents: 'none',
    fontSize: 24,
    right: theme.spacing(3),
    '& .MuiSvgIcon-root': {
      color: props =>
        props.active
          ? theme.palette.primary.main
          : theme.palette.text.primary
    }
  }
}))

const SelectionButton = ({
  small,
  active,
  icon,
  primary,
  secondary,
  secondaryIcon = <RightIcon />,
  SecondaryActionProps = {},
  TextProps = {},
  classes: overrides = {},
  ...props
}) => {
  const classes = useStyles({ small, active })
  return (
    <ListItem
      classes={{
        root: clsx(
          'selection-button',
          classes.root,
          overrides.root
        )
      }}
      button
      {...props}>
      {icon && (
        <ListItemIcon
          classes={{
            root: clsx(
              'selection-button__icon',
              classes.icon,
              overrides.icon
            )
          }}>
          {icon}
        </ListItemIcon>
      )}
      <ListItemText
        primary={primary}
        secondary={secondary}
        classes={{
          root: classes.text,
          secondary: classes.secondary
        }}
        {...TextProps}
      />
      <ListItemSecondaryAction
        className={classes.secondaryAction}
        {...SecondaryActionProps}>
        {secondaryIcon}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

SelectionButton.propTypes = {}

export default SelectionButton
