import React from 'react'
import Icon from './Icon'

const SearchIcon = ({ ...props }) => {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        d="M10.5 3.5C6.634 3.5 3.5 6.634 3.5 10.5C3.5 14.366 6.634 17.5 10.5 17.5C14.366 17.5 17.5 14.366 17.5 10.5C17.5 6.634 14.366 3.5 10.5 3.5ZM2.5 10.5C2.5 6.08172 6.08172 2.5 10.5 2.5C14.9183 2.5 18.5 6.08172 18.5 10.5C18.5 14.9183 14.9183 18.5 10.5 18.5C6.08172 18.5 2.5 14.9183 2.5 10.5Z"
      />
      <path
        fillRule="evenodd"
        d="M15.6474 15.6464C15.8427 15.4512 16.1593 15.4512 16.3545 15.6464L21.3545 20.6464C21.5498 20.8417 21.5498 21.1583 21.3545 21.3535C21.1593 21.5488 20.8427 21.5488 20.6474 21.3535L15.6474 16.3536C15.4522 16.1583 15.4522 15.8417 15.6474 15.6464Z"
      />
    </Icon>
  )
}

export default SearchIcon
