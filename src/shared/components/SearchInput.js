import React from 'react'
import PropTypes from 'prop-types'

import {
  InputAdornment,
  makeStyles,
  TextField
} from '@material-ui/core'
import clsx from 'clsx'
import { SearchIcon, CloseIcon } from '../../modules/icons'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  input: {
    boxSizing: 'border-box',
    height: theme.spacing(4.5),
    padding: `18px 14px`
  }
}))

const SearchInput = ({
  classes: overrides,
  onChange,
  onClear,
  inputProps,
  ...props
}) => {
  const classes = useStyles()
  return (
    <TextField
      variant="outlined"
      className={clsx('search', classes.root, overrides.root)}
      InputProps={{
        classes: {
          input: clsx(
            'search__input',
            classes.input,
            overrides.input
          )
        },
        endAdornment: (
          <InputAdornment position="end">
            {inputProps.value ? (
              <CloseIcon onClick={onClear} />
            ) : (
              <SearchIcon />
            )}
          </InputAdornment>
        ),
        inputProps
      }}
      onChange={onChange}
      {...props}
    />
  )
}

SearchInput.propTypes = {
  classes: PropTypes.object,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  inputProps: PropTypes.object
}
SearchInput.defaultProps = {
  classes: {},
  inputProps: {}
}

export default SearchInput
