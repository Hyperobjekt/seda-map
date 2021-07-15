import React from 'react'
import PropTypes from 'prop-types'
import { Button, Menu, MenuItem } from '@material-ui/core'
import { getPrefixLang } from '../../app/selectors/lang'

const SedaMetricMenu = ({
  metrics,
  onSelect,
  children,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = metric => {
    onSelect && onSelect(metric)
    handleClose()
  }
  return (
    <>
      <Button
        variant="outlined"
        aria-controls="metric-menu"
        aria-haspopup="true"
        onClick={handleClick}
        {...props}>
        {children}
      </Button>
      <Menu
        id="metric-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {metrics.map(metric => (
          <MenuItem
            style={{ textTransform: 'capitalize' }}
            key={metric}
            value={metric}
            onClick={() => handleSelect(metric)}>
            {getPrefixLang(metric)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

SedaMetricMenu.propTypes = {}

export default SedaMetricMenu
