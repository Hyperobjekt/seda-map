import React from 'react'
import Icon from './Icon'

const HelpIcon = ({ ...props }) => {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        d="M12 2.5C6.75329 2.5 2.5 6.75329 2.5 12C2.5 17.2467 6.75329 21.5 12 21.5C17.2467 21.5 21.5 17.2467 21.5 12C21.5 6.75329 17.2467 2.5 12 2.5ZM1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12Z"
      />
      <path
        fillRule="evenodd"
        d="M10.0111 8.4846C9.62546 9.04164 9.5 9.68971 9.5 10C9.5 10.2761 9.27614 10.5 9 10.5C8.72386 10.5 8.5 10.2761 8.5 10C8.5 9.51029 8.67454 8.65836 9.1889 7.9154C9.72157 7.14599 10.6179 6.5 12 6.5C13.363 6.5 14.2631 7.0791 14.8058 7.83285C15.3301 8.5611 15.5 9.41999 15.5 10C15.5 11.4096 14.598 12.661 13.2607 13.1068L13.0153 13.1886C12.7076 13.2912 12.5 13.5792 12.5 13.9035V14.5C12.5 14.7761 12.2761 15 12 15C11.7239 15 11.5 14.7761 11.5 14.5V13.9035C11.5 13.1487 11.983 12.4786 12.699 12.2399L12.9445 12.1581C13.8734 11.8485 14.5 10.9792 14.5 10C14.5 9.58001 14.3699 8.9389 13.9942 8.41715C13.6369 7.9209 13.037 7.5 12 7.5C10.9821 7.5 10.3784 7.95401 10.0111 8.4846Z"
      />
      <path d="M12 17H12.01" />
    </Icon>
  )
}

export default HelpIcon
