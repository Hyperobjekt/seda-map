import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import SedaFiltersForm from './SedaFiltersForm'

const SedaFilterPanel = props => {
  return (
    <div className={clsx('filter-select')}>
      <SedaFiltersForm />
    </div>
  )
}

export default SedaFilterPanel
