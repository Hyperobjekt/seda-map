import React from 'react'
import PropTypes from 'prop-types'
import HypButtonGroup from './HypButtonGroup'
import { Button, Tooltip } from '@material-ui/core'

const SedaSchoolType = props => {
  const [active, setActive] = React.useState([0, 1, 2, 3])
  return (
    <HypButtonGroup
      active={active}
      onChange={setActive}
      toggleAll
      {...props}>
      <Button>Regular</Button>
      <Button>Charter</Button>
      <Button>Magnet</Button>
      <Button>
        <Tooltip
          title="Bureau of Indian Education"
          arrow
          placement="top">
          <span>BIE</span>
        </Tooltip>
      </Button>
    </HypButtonGroup>
  )
}

SedaSchoolType.propTypes = {}

export default SedaSchoolType
