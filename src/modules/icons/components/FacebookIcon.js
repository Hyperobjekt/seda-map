import React from 'react'
import PropTypes from 'prop-types'
import SvgIcon from '@material-ui/core/SvgIcon'

const FacebookIcon = ({ classes, ...props }) => {
  return (
    <SvgIcon
      classes={{
        root: 'svg-icon--facebook',
        ...classes
      }}
      {...props}>
      <path d="M16.25 5H14C13.0054 5 12.0516 5.39509 11.3483 6.09835C10.6451 6.80161 10.25 7.75544 10.25 8.75V11H8V14H10.25V20H13.25V14H15.5L16.25 11H13.25V8.75C13.25 8.55109 13.329 8.36032 13.4697 8.21967C13.6103 8.07902 13.8011 8 14 8H16.25V5Z" />
    </SvgIcon>
  )
}

FacebookIcon.propTypes = {
  classes: PropTypes.object
}

export default FacebookIcon
