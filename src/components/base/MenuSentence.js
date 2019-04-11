import React from 'react'
import PropTypes from 'prop-types'
import InlineMenu from './InlineMenu';
import { Typography } from '@material-ui/core';
import { splitLang } from '../../constants/lang';

function MenuSentence({text, controls, onChange, ...rest}) {
  let controlIndex = 0;
  const chunks = splitLang(text)
    .filter(chunk => chunk[0] !== '$' && chunk)
    .reduce((arr, chunk, i) => {
      arr.push(
        <span key={'chunk'+i+'text'}>{chunk}</span> 
      )
      arr.push(
        <InlineMenu 
          key={'chunk'+i+'menu'} 
          {...controls[controlIndex++]}
          onChange={onChange}
        />
      )
      return arr;
    }, [])
  return (
    <Typography component="div" {...rest}>
      { chunks.map(c => c) }
    </Typography>
  )
}

MenuSentence.propTypes = {
  text: PropTypes.string,
  controls: PropTypes.arrayOf(
    PropTypes.shape(InlineMenu.propTypes)
  ),
  onChange: PropTypes.func
}

export default MenuSentence

