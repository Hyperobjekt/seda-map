import React from 'react'
import Icon from './Icon'

const CopyIcon = ({ ...props }) => {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        d="M9 20H16C16.5523 20 17 19.5523 17 19V12.1839C17 11.9244 16.8992 11.6752 16.7189 11.4887L15.1658 9.88266L13.64 8.30484C13.4516 8.11001 13.1921 8 12.9211 8H9C8.44772 8 8 8.44772 8 9V19C8 19.5523 8.44772 20 9 20ZM9 7C7.89543 7 7 7.89543 7 9V19C7 20.1046 7.89543 21 9 21H16C17.1046 21 18 20.1046 18 19V12.1839C18 11.665 17.7984 11.1665 17.4377 10.7935L15.8846 9.1875L14.3588 7.60968C13.982 7.22002 13.4632 7 12.9211 7H9Z"
      />
      <path
        fillRule="evenodd"
        d="M7 18H5C4.44772 18 4 17.5523 4 17V7C4 6.44772 4.44772 6 5 6H8.9211C9.19213 6 9.45155 6.11001 9.63996 6.30484L10.3122 7H11.7033L10.3588 5.60968C9.982 5.22002 9.46316 5 8.9211 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H7V18Z"
      />
      <path
        fillRule="evenodd"
        d="M16.7708 3.89561C16.0243 3.51065 15.0321 3.50002 14 3.50002C13.7239 3.50002 13.5 3.27616 13.5 3.00002C13.5 2.72387 13.7239 2.50002 14 2.50002C14.019 2.50002 14.0381 2.50001 14.0573 2.50001C15.0171 2.4998 16.2454 2.49954 17.2292 3.00681C17.7505 3.27563 18.204 3.68487 18.5211 4.29096C18.8345 4.88978 19 5.65203 19 6.60955C19 6.88569 18.7761 7.10955 18.5 7.10955C18.2239 7.10955 18 6.88569 18 6.60955C18 5.76231 17.853 5.17098 17.6351 4.75462C17.421 4.34553 17.1245 4.07798 16.7708 3.89561Z"
      />
      <path
        fillRule="evenodd"
        d="M16.6464 5.64645C16.8417 5.45118 17.1583 5.45118 17.3536 5.64645L18.5 6.79289L19.6464 5.64645C19.8417 5.45118 20.1583 5.45118 20.3536 5.64645C20.5488 5.84171 20.5488 6.15829 20.3536 6.35355L18.8536 7.85355C18.6583 8.04882 18.3417 8.04882 18.1464 7.85355L16.6464 6.35355C16.4512 6.15829 16.4512 5.84171 16.6464 5.64645Z"
      />
    </Icon>
  )
}

export default CopyIcon