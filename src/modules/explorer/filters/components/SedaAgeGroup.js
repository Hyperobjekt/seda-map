import React from 'react'
import PropTypes from 'prop-types'
import HypButtonGroup from './HypButtonGroup'
import { Button } from '@material-ui/core'

const SedaAgeGroup = props => {
  const [active, setActive] = React.useState([0, 1, 2, 3])
  return (
    <HypButtonGroup
      active={active}
      onChange={setActive}
      toggleAll
      {...props}>
      <Button>Middle</Button>
      <Button>Elementary</Button>
      <Button>Combined</Button>
    </HypButtonGroup>
  )
}

export default SedaAgeGroup
