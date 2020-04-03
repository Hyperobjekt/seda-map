import React from 'react'
import Icon from './Icon'

const ExpandIcon = ({ ...props }) => {
  return (
    <Icon {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.3536 15.3536C18.1583 15.5488 17.8417 15.5488 17.6464 15.3536L12 9.70711L6.35355 15.3536C6.15829 15.5488 5.84171 15.5488 5.64645 15.3536C5.45118 15.1583 5.45118 14.8417 5.64645 14.6464L11.6464 8.64645C11.8417 8.45118 12.1583 8.45118 12.3536 8.64645L18.3536 14.6464C18.5488 14.8417 18.5488 15.1583 18.3536 15.3536Z"
      />
    </Icon>
  )
}

export default ExpandIcon
