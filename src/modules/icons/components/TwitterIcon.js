import React from 'react'
import PropTypes from 'prop-types'
import SvgIcon from '@material-ui/core/SvgIcon'

const TwitterIcon = ({ classes, ...props }) => {
  return (
    <SvgIcon
      classes={{
        root: 'svg-icon--twitter',
        ...classes
      }}
      {...props}>
      <path d="M19 6.00688C18.3471 6.46888 17.6242 6.82223 16.8591 7.05333C16.4485 6.5797 15.9027 6.244 15.2957 6.09164C14.6887 5.93928 14.0497 5.9776 13.4651 6.20143C12.8805 6.42526 12.3785 6.8238 12.027 7.34314C11.6756 7.86248 11.4916 8.47756 11.5 9.10521V9.78917C10.3018 9.82033 9.1145 9.55376 8.04387 9.01318C6.97323 8.4726 6.05249 7.6748 5.36364 6.69084C5.36364 6.69084 2.63636 12.8465 8.77273 15.5823C7.36854 16.5384 5.69579 17.0179 4 16.9502C10.1364 20.37 17.6364 16.9502 17.6364 9.08469C17.6357 8.89418 17.6175 8.70413 17.5818 8.517C18.2777 7.8286 18.7687 6.95943 19 6.00688V6.00688Z" />
    </SvgIcon>
  )
}

TwitterIcon.propTypes = {
  classes: PropTypes.object
}

export default TwitterIcon
