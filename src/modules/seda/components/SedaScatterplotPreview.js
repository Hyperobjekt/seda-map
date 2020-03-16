import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isVersusFromVarNames } from '../../../shared/selectors'
import { getStateFipsFromAbbr } from '../../../shared/selectors/states'
import Scatterplot from '../../scatterplot/components/AltScatterplot'
import useDataOptions from '../hooks/useDataOptions'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: 360,
    height: 240,
    marginRight: 0,
    marginBottom: 0
  },
  axisLabels: {},
  axisLabelsX: {},
  axisLabelsY: {}
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
      highlightedState={getStateFipsFromAbbr(highlightedState)}
    />
  )
}

export default SedaScatterplotPreview
