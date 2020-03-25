import React from 'react'
import useUiStore from '../../hooks/useUiStore'
import {
  makeStyles,
  ButtonGroup,
  Button
} from '@material-ui/core'
import clsx from 'clsx'
import { MapIcon, ChartIcon, SplitIcon } from '../icons'

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
  return (
    <ButtonGroup
      variant="outlined"
      className={clsx(classes.root)}
      {...props}>
      {buttons.map(b => (
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
