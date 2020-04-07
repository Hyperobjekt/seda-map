import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { isVersusFromVarNames } from '../../../../shared/selectors'
import ScatterplotBase from './SedaScatterplotBase'
import clsx from 'clsx'
import SedaLocationMarkers from './SedaLocationMarkers'
import BookEnds from '../../../../base/components/BookEnds'
import { Typography } from '@material-ui/core'
import {
  getLabelForVarName,
  getRegionLabel
} from '../../../../shared/selectors/lang'
import {
  useRegion,
  useScatterplotVars,
  useFilters
} from '../../hooks'

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
  axisLabels: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888'
  },
  axisLabelsY: {
    width: 200
  },
  markers: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}))

const SedaScatterplotPreview = props => {
  // pull required data from store
  const [region] = useRegion()
  const [filters] = useFilters()
  const [xVar, yVar, zVar] = useScatterplotVars()
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const classes = useStyles()
  return (
    <ScatterplotBase
      xVar={xVar}
      yVar={yVar}
      zVar={zVar}
      className={clsx(classes.root, {
        'scatterplot--versus': isVersus
      })}
      region={region}
      filters={filters}
      variant="preview"
      {...props}>
      <SedaLocationMarkers className={classes.markers} />
      <BookEnds
        style={{
          position: 'absolute',
          right: -12,
          top: 0,
          bottom: 0,
          width: 0
        }}
        classes={{
          contentContainer: clsx(
            classes.axisLabels,
            classes.axisLabelsY
          )
        }}
        vertical>
        <Typography
          style={{
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          variant="body1">
          {getLabelForVarName(yVar, {
            region: getRegionLabel(region)
          })}
        </Typography>
      </BookEnds>
      <BookEnds
        style={{
          position: 'absolute',
          right: 0,
          left: 0,
          bottom: -20
        }}
        classes={{
          contentContainer: clsx(classes.axisLabels)
        }}>
        <Typography
          style={{
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          variant="body1">
          {getLabelForVarName(xVar, {
            region: getRegionLabel(region)
          })}
        </Typography>
      </BookEnds>
    </ScatterplotBase>
  )
}

export default SedaScatterplotPreview
