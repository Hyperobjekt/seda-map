import React from 'react'
import {
  getFormatterForVarName,
  getMidpointForVarName
} from '../app/selectors'
import { DivergingStatValue } from '../../../shared'

const SedaStat = ({ varName, value, ...props }) => {
  return (
    <DivergingStatValue
      value={value}
      formatter={getFormatterForVarName(varName)}
      mid={getMidpointForVarName(varName)}
      {...props}
    />
  )
}

SedaStat.propTypes = DivergingStatValue.propTypes

export default SedaStat
