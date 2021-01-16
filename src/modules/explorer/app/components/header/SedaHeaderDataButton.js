import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  IconButton,
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core'
import { useActivePanel } from '../../../panels'

const styles = theme => ({
  button: {},
  icon: {
    width: 'auto',
    height: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(3),
    }
  },
  tooltip: {}
})

const SettingsIcon = props => (
  <svg
    {...props}
    width="19"
    height="20"
    viewBox="0 0 19 20"
    fill="none">
    <line
      x1="16.425"
      y1="1.85773e-08"
      x2="16.425"
      y2="20"
      stroke="#031232"
      strokeWidth="0.85"
    />
    <line
      x1="9.425"
      y1="1.85773e-08"
      x2="9.425"
      y2="20"
      stroke="#031232"
      strokeWidth="0.85"
    />
    <line
      x1="2.425"
      y1="1.85773e-08"
      x2="2.425"
      y2="20"
      stroke="#031232"
      strokeWidth="0.85"
    />
    <circle
      cx="16.5"
      cy="6.5"
      r="2.075"
      fill="white"
      stroke="#031232"
      strokeWidth="0.85"
    />
    <circle
      cx="9.5"
      cy="14.5"
      r="2.075"
      fill="white"
      stroke="#031232"
      strokeWidth="0.85"
    />
    <circle
      cx="2.5"
      cy="5.5"
      r="2.075"
      fill="white"
      stroke="#031232"
      strokeWidth="0.85"
    />
  </svg>
)

const DataOptionsTooltip = ({ onClick, ...props }) => {
  return (
    <div onClick={onClick} style={{display: 'flex', alignItems: 'center', padding: 8}} {...props}>
      <Typography variant="body1">
        Press this button to change opportunity metrics,
        subgroups, filters, and locations for the current view.
      </Typography>
      <Button color="secondary" variant="contained" onClick={onClick} stlye={{minWidth: 90, marginLeft: 8}}>OK</Button>
    </div>
  )
}

const SedaHeaderDataButton = ({classes}) => {
  const [tooltipOpen, setTooltipOpen] = useState(true)
  const [activePanel, setActivePanel] = useActivePanel()

  const handleDismissTooltip = () => {
    setTooltipOpen(false)
  }

  const handleToggleSettings = () => {
    setTooltipOpen(false)
    const toggleValue =
      activePanel === 'options' ? null : 'options'
    setActivePanel(toggleValue)
  }

  return (
    <Tooltip
      interactive={true}
      disableFocusListener={true}
      disableHoverListener={true}
      disableTouchListener={true}
      open={tooltipOpen}
      PopperProps={{
        popperOptions:{
          modifiers: {
             offset: {
                enabled: true,
                offset: '0,0',
             },
          },
        }
      }}
      title={
        <DataOptionsTooltip className={classes.tooltip} onClick={handleDismissTooltip} />
      }
      arrow
      >
      <IconButton
        className={classes.root}
        onClick={handleToggleSettings}>
        <SettingsIcon className={classes.logo} />
      </IconButton>
    </Tooltip>
  )
}

export default withStyles(styles)(SedaHeaderDataButton)
