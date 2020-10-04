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
import { RightIcon } from '../../../modules/icons'

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

/**
 * List item menu button that can have a left icon, primary text, secondary text, and right icon (secondary)
 */
const SelectionButton = ({
  small,
  active,
  icon,
  primary,
  secondary,
  secondaryIcon,
  SecondaryActionProps,
  TextProps,
  className,
  classes: overrides,
  ...props
}) => {
  const classes = useStyles({ small, active })
  return (
    <ListItem
      classes={{
        root: clsx(
          'selection-button',
          classes.root,
          overrides.root,
          className
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

SelectionButton.defaultProps = {
  secondaryIcon: <RightIcon />,
  SecondaryActionProps: {},
  TextProps: {},
  classes: {}
}

SelectionButton.propTypes = {
  /** small variant of selection button */
  small: PropTypes.bool,
  /** boolean indicating active state of button */
  active: PropTypes.bool,
  /** icon for the left side */
  icon: PropTypes.node,
  /** primary text for button */
  primary: PropTypes.string,
  /** secondary text for button */
  secondary: PropTypes.string,
  /** icon for the right side */
  secondaryIcon: PropTypes.node,
  /** props for the ListItemSecondaryAction (right side) */
  SecondaryActionProps: PropTypes.object,
  /** props for the ListItemText component */
  TextProps: PropTypes.object,
  /** class name for the root element */
  className: PropTypes.string,
  /** class names for elements (`root`, `icon`, `text`, `secondary`, `secondaryAction`) */
  classes: PropTypes.object
}

export default SelectionButton
