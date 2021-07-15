import React from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, withStyles } from '@material-ui/core'
import clsx from 'clsx'

const styles = theme => ({
  root: {},
  button: {},
  active: {
    color: theme.palette.primary.main,
    background: theme.palette.primary.highlight,
    borderColor: theme.palette.primary.main,
    // need to force right border color
    borderRightColor: theme.palette.primary.main + '!important'
  }
})

const HypButtonGroup = ({
  classes,
  className,
  active,
  children,
  toggleAll,
  onChange,
  ...props
}) => {
  // returns true if the child button is active
  const isChildActive = (child, index) => {
    const value = child.value || index
    if (!toggleAll) return active === value
    return active.indexOf(value) !== -1
  }

  const handleChange = (child, index) => {
    const value = child.value || index
    if (!toggleAll) return onChange && onChange(value)
    const newActive =
      active.indexOf(value) > -1
        ? active.filter(item => item !== value)
        : [...active, value]
    return onChange && onChange(newActive)
  }

  const childrenWithProps = React.Children.map(
    children,
    (child, index) => {
      const { value, label, ...props } = child.props
      return React.cloneElement(child, {
        ...props,
        className: clsx(
          classes.button,
          {
            [classes.active]: isChildActive(child, index)
          },
          child.className
        ),
        onClick: () => handleChange(child, index)
      })
    }
  )

  return (
    <ButtonGroup
      variant="outlined"
      className={clsx(classes.root, className)}
      {...props}>
      {childrenWithProps}
    </ButtonGroup>
  )
}

HypButtonGroup.propTypes = {
  toggleAll: PropTypes.bool,
  active: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object
}

export default withStyles(styles)(HypButtonGroup)
