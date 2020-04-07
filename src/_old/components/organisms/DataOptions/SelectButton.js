import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';


const SelectButton = ({
  text, 
  subtext, 
  icon = <UnfoldMoreIcon />, 
  ...rest
}) => {
  return (
    <Button classes={{
      root: "select-button",
      label: "select-button__label"
     }} 
     {...rest}
    >
      <span className="select-button__text">{text}</span>
      <span className="select-button__subtext">{subtext}</span>
      {icon}
    </Button>
  )
}

SelectButton.propTypes = {
  text: PropTypes.string,
  subtext: PropTypes.string,
  icon: PropTypes.node,
}

export default SelectButton
