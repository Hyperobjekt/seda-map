import React from 'react'
import PropTypes from 'prop-types'
import HypButtonGroup from './HypButtonGroup'
import { Button } from '@material-ui/core'

const SedaAreaClassification = props => {
  const [active, setActive] = React.useState([0, 1, 2, 3])
  return (
    <HypButtonGroup
      active={active}
      onChange={setActive}
      toggleAll
      {...props}>
      <Button>Rural</Button>
      <Button>Town</Button>
      <Button>Suburban</Button>
      <Button>Urban</Button>
    </HypButtonGroup>
  )
}

SedaAreaClassification.propTypes = {}

export default SedaAreaClassification
