import React from 'react'
import PropTypes from 'prop-types'
import AccordionItem from '../molecules/AccordionItem';

const Accordion = ({items, expanded = [], onToggle, ...rest}) => {
  return (
    <div className='accordion'>
      {
        items.map((item, i) =>
          <AccordionItem
            key={'item-'+i}
            {...item}
            expanded={expanded.indexOf(item.id) > -1}
            onChange={onToggle}
            {...rest}
          />
        )
      }
    </div>
  )
}

Accordion.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape(AccordionItem.propTypes)
  ),
  expanded: PropTypes.array,
  onToggle: PropTypes.func.isRequired,
}

export default Accordion
