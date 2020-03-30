import React from 'react'
import useUiStore from '../../hooks/useUiStore'
import {
  makeStyles,
  ButtonGroup,
  Button
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import clsx from 'clsx'
import { MapIcon, ChartIcon, SplitIcon } from '../../../icons'

const useStyles = makeStyles(theme => ({
  root: {},
  button: {
    whiteSpace: 'nowrap'
  },
  active: {
    color: theme.palette.primary.main
  }
}))

const buttons = [
  { id: 'map', label: 'Map', icon: <MapIcon /> },
  { id: 'chart', label: 'Chart', icon: <ChartIcon /> },
  { id: 'split', label: 'Map + Chart', icon: <SplitIcon /> }
]

const SedaViewControls = ({ classes: overrides, ...props }) => {
  const classes = useStyles()
  const view = useUiStore(state => state.view)
  const setView = useUiStore(state => state.setView)
  const theme = useTheme()
  const isLargeViewport = useMediaQuery(
    theme.breakpoints.up('md')
  )
  /** no split view button on small viewports */
  const viewButtons = isLargeViewport
    ? buttons
    : [buttons[0], buttons[1]]
  return (
    <ButtonGroup
      variant="outlined"
      className={clsx(classes.root)}
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

export default SedaViewControls
