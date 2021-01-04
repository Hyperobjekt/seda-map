import React from 'react'
import {
  getFormatterForVarName,
  getMidpointForVarName,
  isGapVarName
} from '../app/selectors'
import { DivergingStatValue } from '../../../shared'

const SedaStat = ({ varName, value, ...props }) => {
  const isGap = isGapVarName(varName)
  return (
    <DivergingStatValue
      value={value}
      invertColor={isGap}
      formatter={getFormatterForVarName(varName)}
      mid={getMidpointForVarName(varName)}
      {...props}
    />
  )
}

SedaStat.propTypes = DivergingStatValue.propTypes

export default SedaStat
