import React from 'react'
import {
  IconButton,
  Tooltip,
  withStyles
} from '@material-ui/core'
import UnitedStatesIcon from '../../icons/components/UnitedStatesIcon'
import AlaskaIcon from '../../icons/components/AlaskaIcon'
import HawaiiIcon from '../../icons/components/HawaiiIcon'
import PuertoRicoIcon from '../../icons/components/PuertoRicoIcon'
import { useMapStore } from '../../map'
import {
  ALASKA_VIEWPORT,
  HAWAII_VIEWPORT,
  PUERTO_RICO_VIEWPORT,
  US_VIEWPORT
} from './constants'
import clsx from 'clsx'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxShadow: `var(--shadow10)`
  },
  button: {
    color: theme.palette.text.primary,
    width: 30,
    height: 30,
    padding: 0,
    borderTop: `1px solid`,
    borderTopColor: '#ddd',
    borderRadius: 0,
    '&:first-child': {
      borderTop: 'none'
    }
  }
})

const SedaZoomControls = ({ classes, className, ...props }) => {
  const flyToViewport = useMapStore(state => state.flyToViewport)

  const handleZoomToUS = () => flyToViewport(US_VIEWPORT)

  const handleZoomToAlaska = () => flyToViewport(ALASKA_VIEWPORT)

  const handleZoomToHawaii = () => flyToViewport(HAWAII_VIEWPORT)

  const handleZoomToPuertoRico = () =>
    flyToViewport(PUERTO_RICO_VIEWPORT)

  return (
    <div className={clsx(classes.root, className)} {...props}>
      <Tooltip placement="left" title="Zoom to contiguous U.S.">
        <IconButton
          className={classes.button}
          onClick={handleZoomToUS}>
          <UnitedStatesIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="left" title="Zoom to Alaska">
        <IconButton
          className={classes.button}
          onClick={handleZoomToAlaska}>
          <AlaskaIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="left" title="Zoom to Hawaii">
        <IconButton
          className={classes.button}
          onClick={handleZoomToHawaii}>
          <HawaiiIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="left" title="Zoom to Puerto Rico">
        <IconButton
          className={classes.button}
          onClick={handleZoomToPuertoRico}>
          <PuertoRicoIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default withStyles(styles)(SedaZoomControls)
