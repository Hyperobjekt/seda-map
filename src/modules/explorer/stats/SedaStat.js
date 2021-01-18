import React from 'react'
import {
  getFormatterForVarName,
  getMidpointForVarName,
  isGapVarName
} from '../app/selectors'
import { DivergingStatValue } from '../../../shared'
import { format } from 'd3-format'

const formatMoe = format('.1r')
const formatMoeGrd = format('.1%')

const SedaStat = ({
  varName,
  value,
  marginOfError,
  ...props
}) => {
  const isGap = isGapVarName(varName)
  const moeFormatter =
    varName.indexOf('grd') > -1 ? formatMoeGrd : formatMoe
  return (
    <DivergingStatValue
      value={value}
      invertColor={isGap}
      formatter={getFormatterForVarName(varName)}
      mid={getMidpointForVarName(varName)}
      marginOfError={
        marginOfError && moeFormatter(marginOfError)
      }
      {...props}
    />
  )
}

SedaStat.propTypes = DivergingStatValue.propTypes

export default SedaStat
