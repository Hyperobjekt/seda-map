import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isVersusFromVarNames } from '../../../../shared/selectors'
import { getStateFipsFromAbbr } from '../../../../shared/selectors/states'
import Scatterplot from '../../../scatterplot/components/AltScatterplot'
import useDataOptions from '../../hooks/useDataOptions'
import clsx from 'clsx'
import SedaLocationMarkers from './SedaLocationMarkers'
import BookEnds from '../../../../base/components/BookEnds'
import { Typography } from '@material-ui/core'
import {
  getLabelForVarName,
  getRegionLabel
} from '../../../../shared/selectors/lang'

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
  }
}))

const SedaScatterplotPreview = () => {
  // pull required data from store
  const region = useDataOptions(state => state.region)
  const { xVar, yVar, zVar } = useDataOptions(state =>
    state.getScatterplotVars()
  )
  const highlightedState = null
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const classes = useStyles()
  return (
    <Scatterplot
      xVar={xVar}
      yVar={yVar}
      zVar={zVar}
      className={clsx(classes.root, {
        'scatterplot--versus': isVersus
      })}
      region={region.id}
      variant="preview"
      highlightedState={getStateFipsFromAbbr(highlightedState)}>
      <SedaLocationMarkers />
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
            'text-overflow': 'ellipsis'
          }}
          variant="body1">
          {getLabelForVarName(yVar, {
            region: getRegionLabel(region.id)
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
            'text-overflow': 'ellipsis'
          }}
          variant="body1">
          {getLabelForVarName(xVar, {
            region: getRegionLabel(region.id)
          })}
        </Typography>
      </BookEnds>
    </Scatterplot>
  )
}

export default SedaScatterplotPreview
