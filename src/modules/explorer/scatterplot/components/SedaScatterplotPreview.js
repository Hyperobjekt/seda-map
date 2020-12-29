import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { isVersusFromVarNames } from '../../app/selectors'
import ScatterplotBase from './SedaScatterplotBase'
import clsx from 'clsx'
import useScatterplotVars from '../hooks/useScatterplotVars'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: 312,
    height: 200,
    marginRight: 0,
    marginBottom: 0,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      border: '1px solid',
      borderColor: theme.palette.divider
    }
  },
  axis: {
    '& .MuiTypography-root': {
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      fontSize: 12,
      color: theme.palette.grey[500]
    }
  },
  xAxis: {
    bottom: -20,
    '& .book-end__contentContainer': {
      width: '100%'
    }
  },
  yAxis: {
    right: -12,
    '& .MuiTypography-root': { width: 200 }
  },
  markers: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}))

const SedaScatterplotPreview = props => {
  const [xVar, yVar] = useScatterplotVars()
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const classes = useStyles()
  return (
    <ScatterplotBase
      className={clsx(classes.root, {
        'scatterplot--versus': isVersus
      })}
      classes={classes}
      variant="preview"
      {...props}
    />
  )
}

export default SedaScatterplotPreview
