import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: '1em',
    height: '1em',
    fill: 'currentColor',
    '& .filled': {
      opacity: 0
    }
  }
}))

const FilterIcon = ({ color, active, size = 24, ...props }) => {
  const classes = useStyles()
  return (
    <svg
      className={clsx('icon', classes.root)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontSize: size }}
      {...props}>
      <path
        className="filled"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.2036 3.25C3.70008 3.25 2.89651 5.02086 3.88659 6.15238L9.18798 12.2111C9.22785 12.2567 9.24983 12.3152 9.24983 12.3757V17.882C9.24983 18.5448 9.62434 19.1508 10.2172 19.4472L12.2172 20.4472C13.3808 21.029 14.7498 20.1829 14.7498 18.882V12.355C14.7498 12.2976 14.7696 12.242 14.8058 12.1974L19.7571 6.10354L19.1899 5.64272L19.7571 6.10354C20.6863 4.95989 19.8724 3.25 18.3989 3.25H5.2036Z"
      />
      <path
        className="outline"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.07523 5.98776C3.22658 5.01788 3.91536 3.5 5.20409 3.5H18.3994C19.6624 3.5 20.36 4.96562 19.5635 5.94589L14.6123 12.0397C14.5399 12.1289 14.5003 12.2402 14.5003 12.355V18.882C14.5003 19.997 13.3269 20.7223 12.3295 20.2236L10.3295 19.2236C9.82133 18.9695 9.50032 18.4501 9.50032 17.882V12.3757C9.50032 12.2546 9.45636 12.1376 9.37661 12.0465L4.07523 5.98776ZM5.20409 4.5C4.77451 4.5 4.54492 5.00596 4.8278 5.32925L10.1292 11.388C10.3684 11.6614 10.5003 12.0124 10.5003 12.3757V17.882C10.5003 18.0714 10.6073 18.2445 10.7767 18.3292L12.7767 19.3292C13.1092 19.4954 13.5003 19.2537 13.5003 18.882V12.355C13.5003 12.0105 13.6189 11.6765 13.8362 11.4092L18.7874 5.3153C19.0529 4.98854 18.8204 4.5 18.3994 4.5H5.20409Z"
      />
    </svg>
  )
}

FilterIcon.propTypes = {}

export default FilterIcon
