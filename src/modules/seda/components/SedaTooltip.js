import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  getLang,
  getDescriptionForVarName
} from '../../../shared/selectors/lang'
import {
  getDemographicIdFromVarName,
  isVersusFromVarNames,
  getDemographicForVarNames,
  isGapVarName,
  getFeatureProperty
} from '../../../shared/selectors'
import { getStateName } from '../../../shared/selectors/states'
import { Typography, makeStyles } from '@material-ui/core'
import useUiStore from '../hooks/useUiStore'
import clsx from 'clsx'
import Tooltip from '../../../components/atoms/Tooltip'
import debug from 'debug'
import useDataOptions from '../hooks/useDataOptions'
import useScatterplotStore from '../hooks/useScatterplotStore'

debug.enable('Tooltip')
const log = debug('Tooltip')

const getDemographicLabel = varName => {
  const dem = getDemographicIdFromVarName(varName)
  return getLang('LABEL_' + dem)
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0
  }
}))

const SedaTooltip = props => {
  const hoveredId = useUiStore(state => state.hovered)
  const [x, y] = useUiStore(state => state.coords)
  const { xVar, yVar } = useDataOptions(state =>
    state.getScatterplotVars()
  )
  const data = useScatterplotStore(state =>
    state.getDataForId(hoveredId)
  )
  const classes = useStyles()
  const above =
    window.innerHeight && y && y > window.innerHeight / 3
  const left =
    window.innerWidth && x && x > window.innerWidth / 2
  const isVersus = isVersusFromVarNames(xVar, yVar)
  const demographic = getDemographicForVarNames(xVar, yVar)
  const descriptionVars = isVersus
    ? [demographic + '_' + xVar.split('_')[1]]
    : [yVar, xVar]
  const stateName = data.id ? getStateName(data.id) : ''

  // add var to feature if missing
  if (isVersus && !data[descriptionVars[0]]) {
    data[descriptionVars[0]] = data[yVar] - data[xVar]
  }
  const description = descriptionVars.reduce((desc, varName) => {
    const val = data[varName]
    return val || val === 0
      ? desc + getDescriptionForVarName(varName, val) + ' '
      : desc
  }, '')

  return (
    <div className={clsx('tooltip__wrapper', classes.root)}>
      {hoveredId && (
        <Tooltip
          title={data.name}
          subtitle={stateName}
          x={x}
          y={y}
          above={above}
          left={left}>
          <Typography
            className="tooltip__description"
            variant="caption"
            dangerouslySetInnerHTML={{
              __html:
                description +
                '<em>' +
                getLang('TOOLTIP_SUMMARY') +
                '</em>'
            }}
          />
        </Tooltip>
      )}
    </div>
  )
}

SedaTooltip.propTypes = {}

export default SedaTooltip
