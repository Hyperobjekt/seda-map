import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Tabs, Tab } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import LocationItem from './LocationItem';


const CardTransition = (props) => (
  <CSSTransition
    {...props}
    classNames="summary-group__cards"
    timeout={{ enter: 500, exit: 300 }}
  />
);

const LocationStack = ({
  cards = [],
  activeId = null,
  children,
  classes = {},
  onCardDismiss,
  onCardClick,
  onCardHover,
  onCardExited,
  onCardEntered
}) => {
  const cardComponents = cards.map((c, i) => (
    <CardTransition 
      key={c.id} 
      onExited={() => onCardExited && onCardExited(c)}
      onEntered={() => onCardEntered && onCardEntered(c)}
    >
      <Tab 
        component="div"
        onClick={() => onCardClick && onCardClick(c)}
        label={
          <LocationItem
            key={'f'+i} 
            idx={i} 
            feature={c.feature}
            onHover={() => onCardHover && onCardHover(c)}
            actionIcon={<CloseIcon />}
            onActionPress={() => onCardDismiss && onCardDismiss(c)}
          />
        }
        classes={{
          root: 'tab',
          selected: 'tab--selected',
          wrapper: 'tab__wrapper'
        }} 
      />
    </CardTransition>
  ))
  return (
    <div className={classNames("summary-group", classes.root)}>
      <TransitionGroup
        component={Tabs}
        className='summary-group__cards'
        variant='scrollable'
        scrollButtons={ cards.length > 4 ? 'on' : 'off' }
        value={0}
      >
        { cardComponents }
      </TransitionGroup>
      { children }
    </div>
  )
}

LocationStack.propTypes = {
  cards: PropTypes.array,
  activeId: PropTypes.string,
  metrics: PropTypes.array,
  demographic: PropTypes.string,
  classes: PropTypes.object,
  children: PropTypes.node,
  onCardDismiss: PropTypes.func,
  onCardClick: PropTypes.func,
  onCardHover: PropTypes.func,
  onCardExited: PropTypes.func,
  onCardEntered: PropTypes.func,
}

export default LocationStack
