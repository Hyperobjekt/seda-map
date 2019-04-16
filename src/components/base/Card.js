import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'

function Card({
  title, 
  subtitle,
  children,
  dark,
  classes = {},
  ...rest
}) {
  return (
    <div className={classNames('card', classes.root, { 'dark': dark })} {...rest}>
      <div className='card__header'>
        <div className="card__title">{title}</div>
        <div className='card__subtitle'>{subtitle}</div>      
      </div>
      <div className='card__body'>
        {children}
      </div>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
  dark: PropTypes.bool,
}

export default Card

