import React from 'react'
import PropTypes from 'prop-types'

const SedaTitle = props => {
  const heading = getTitleFromSelections({
    metric,
    demographic,
    region
  })
  const subheading = getSubtitleFromSelections({
    metric,
    demographic,
    region
  })
  return <div />
}

SedaTitle.propTypes = {}

export default SedaTitle
