import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Arrow from '../atoms/Arrow'
import { parseColor } from '../../shared/utils'

const getLowOpacityColor = (color, opacity = 0.5) => {
  const [r, g, b] = parseColor(color)
  return `rgba(${r},${g},${b},${opacity})`
}

const StatArrow = ({
  value,
  color,
  classes = {},
  className,
  formatter,
  valueToColor,
  valueToPosition = v => (v > 0 ? 'up' : v < 0 ? 'down' : null),
  ...props
}) => {
  const bgColor = color
    ? color
    : typeof valueToColor === 'function'
    ? valueToColor(value)
    : null
  const valueBg = bgColor
    ? getLowOpacityColor(bgColor, 0.25)
    : 'rgba(0,0,0,0.1)'
  return (
    <div
      className={classNames('arrow-stat', classes.root, className)}
      {...props}>
      <Arrow
        className={classNames('arrow-stat__arrow', classes.arrow)}
        color={bgColor}
        direction={valueToPosition(value)}
      />
      <span className="arrow-stat__value" style={{ backgroundColor: valueBg }}>
        {formatter ? formatter(value) : value}
      </span>
    </div>
  )
}

StatArrow.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  valueToPosition: PropTypes.func,
  valueToColor: PropTypes.func,
  formatter: PropTypes.func,
  classes: PropTypes.object,
  className: PropTypes.string
}

export default StatArrow
