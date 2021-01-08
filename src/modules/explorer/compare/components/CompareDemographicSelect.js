import React from 'react'
import PropTypes from 'prop-types'
import { getDemographics, getGaps } from '../../app/selectors'
import { useCompareStore } from '..'
import shallow from 'zustand/shallow'
import { SelectMenu } from '../../../../shared/components'
import { getPrefixLang } from '../../app/selectors/lang'

const gaps = getGaps().map(g => g.id)
const demographics = getDemographics().map(d => d.id)
const options = [...demographics, ...gaps]

const DemographicSelect = ({ value, ...props }) => {
  return (
    <SelectMenu items={options} {...props}>
      {getPrefixLang(value, 'LABEL')}
    </SelectMenu>
  )
}

const CompareDemographicSelect = props => {
  const [demographic, setDemographic] = useCompareStore(
    state => [state.demographic, state.setDemographic],
    shallow
  )

  const handleSelect = val => {
    console.log('select demographic', val)
    setDemographic(val)
  }

  return (
    <DemographicSelect
      value={demographic}
      onSelect={handleSelect}
    />
  )
}

CompareDemographicSelect.propTypes = {}

export default CompareDemographicSelect
