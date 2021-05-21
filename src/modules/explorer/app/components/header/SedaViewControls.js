import React from 'react'
import {
  withStyles,
  ButtonGroup,
  Button
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import clsx from 'clsx'
import { MapIcon, ChartIcon, SplitIcon } from '../../../../icons'
import { useActiveView } from '../../hooks'

const styles = theme => ({
  root: {},
  button: {
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      border: 0
    }
  },
  active: {
    color: theme.palette.primary.main,
    background: 'white',
    [theme.breakpoints.down('sm')]: {
      background: theme.palette.primary.highlight
    }
  }
})

const buttons = [
  { id: 'map', label: 'Map', icon: <MapIcon /> },
  { id: 'chart', label: 'Chart', icon: <ChartIcon /> },
  { id: 'split', label: 'Map + Chart', icon: <SplitIcon /> }
]

const SedaViewControls = ({ classes, className, ...props }) => {
  const [view, setView] = useActiveView()
  const theme = useTheme()
  const isLargeViewport = useMediaQuery(
    theme.breakpoints.up('lg')
  )
  /** no split view button on small viewports */
  const viewButtons = isLargeViewport
    ? buttons
    : [buttons[0], buttons[1]]
  return (
    <ButtonGroup
      variant="outlined"
      className={clsx(classes.root, className)}
      {...props}>
      {viewButtons.map(b => (
        <Button
          key={b.id}
          className={clsx(classes.button, {
            [classes.active]: view === b.id
          })}
          onClick={() => setView(b.id)}
          startIcon={b.icon}>
          {b.label}
        </Button>
      ))}
    </ButtonGroup>
  )
}

SedaViewControls.propTypes = {}

export default withStyles(styles)(SedaViewControls)
