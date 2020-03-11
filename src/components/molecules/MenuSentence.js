import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import InlineMenu from '../atoms/InlineMenu'
import { Typography } from '@material-ui/core'
import { splitLang } from '../../shared/selectors/lang'

function MenuSentence({ templateString, controls, onChange, ...rest }) {
  let controlIndex = 0
  const chunks = useMemo(
    () =>
      splitLang(templateString)
        .filter(chunk => chunk[0] !== '$' && chunk)
        .reduce((arr, chunk, i) => {
          arr.push(<span key={'chunk' + i + 'text'}>{chunk}</span>)
          arr.push(
            <InlineMenu
              key={'chunk' + i + 'menu'}
              {...controls[controlIndex++]}
              onChange={onChange}
            />
          )
          return arr
        }, []),
    [templateString, controls]
  )
  return (
    <Typography component="div" className="menu-sentence" {...rest}>
      {chunks.map(c => c)}
    </Typography>
  )
}

MenuSentence.propTypes = {
  templateString: PropTypes.string,
  controls: PropTypes.arrayOf(PropTypes.shape(InlineMenu.propTypes)),
  onChange: PropTypes.func
}

export default MenuSentence
