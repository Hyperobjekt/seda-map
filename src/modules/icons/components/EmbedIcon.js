import React from 'react'
import { SvgIcon } from '@material-ui/core'

const EmbedIcon = ({ classes, ...props }) => {
  return (
    <SvgIcon
      classes={{
        root: 'svg-icon--embed',
        ...classes
      }}
      {...props}>
      <path
        fillRule="evenodd"
        d="M14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289L21.7071 11.2929C22.0976 11.6834 22.0976 12.3166 21.7071 12.7071L15.7071 18.7071C15.3166 19.0976 14.6834 19.0976 14.2929 18.7071C13.9024 18.3166 13.9024 17.6834 14.2929 17.2929L19.5858 12L14.2929 6.70711C13.9024 6.31658 13.9024 5.68342 14.2929 5.29289Z"
      />
      <path
        fillRule="evenodd"
        d="M9.70711 5.29289C10.0976 5.68342 10.0976 6.31658 9.70711 6.70711L4.41421 12L9.70711 17.2929C10.0976 17.6834 10.0976 18.3166 9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289Z"
      />
    </SvgIcon>
  )
}

export default EmbedIcon