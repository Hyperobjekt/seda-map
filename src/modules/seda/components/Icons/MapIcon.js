import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: '1em',
    height: '1em',
    fill: 'currentColor'
  }
}))

const MapIcon = ({ color, size = 16, ...props }) => {
  const classes = useStyles()
  return (
    // <svg
    //   className={clsx("icon", classes.root)}
    //   viewBox="0 0 16 16"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   style={{ fontSize: size }}
    //   {...props}
    // >
    //   <path
    //     d="M9.06356 4.92278L2.25545 4C1.49641 4 0.892266 6.13077 1.01619 7.45621C1.14012 8.78166 1.42357 9.0595 2.45682 10.0064C3.28341 10.764 4.24373 10.8078 4.70295 10.7447C5.56399 10.7447 5.55257 12.0432 5.88267 11.7648C6.65477 11.1138 7.08813 12.333 7.43254 12.9012C7.77696 13.4693 8.17748 11.3861 9.21072 11.7648C10.244 12.1436 9.83577 11.3319 10.8837 11.3319C11.8751 11.3319 12.2926 13.211 12.9432 12.9012C13.5326 12.6205 12.3471 11.5025 12.4328 10.7279C12.5257 9.88767 13.6565 9.58699 13.6565 8.91588C13.6565 8.01393 13.4648 8.17527 13.5791 7.70788C13.7185 7.13744 13.9007 6.99997 14.3071 6.53344C14.8338 5.92892 15.2547 5.12491 14.8183 4.73822C14.3071 4.28522 13.2073 5.73013 12.7426 6.21466C12.2779 6.69919 11.1694 7.59408 11.3717 6.77672C11.573 5.963 10.6978 5.60227 10.6204 6.58377C10.5605 7.34196 10.1556 7.36394 10.1556 6.65141C10.1556 5.68836 10.0777 5.10606 9.38886 5.48483C8.8378 5.78785 9.55926 4.92278 9.06356 4.92278Z"
    //     fill={color}
    //   />
    // </svg>
    <svg
      className={clsx('icon', classes.root)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style={{ fontSize: size }}
      {...props}>
      <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </svg>
  )
}

MapIcon.propTypes = {}

export default MapIcon
