import React, { useState } from "react"
import PropTypes from "prop-types"
import SearchIcon from "@material-ui/icons/Search"
import CloseIcon from "@material-ui/icons/Close"

import {
  InputAdornment,
  Input,
  makeStyles,
  TextField,
} from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  input: {
    padding: props =>
      props.condensed
        ? `${theme.spacing(1)}px ${theme.spacing(2)}px`
        : `${theme.spacing(2)}px`,
  },
}))

const SearchInput = ({
  classes: overrides,
  condensed,
  ...props
}) => {
  const [searchText, setSearchText] = useState("")
  const classes = useStyles({ condensed })
  return (
    <TextField
      variant="outlined"
      className={clsx("search", classes.root, overrides.root)}
      InputProps={{
        value: searchText,
        classes: {
          input: clsx(
            "search__input",
            classes.input,
            overrides.input
          ),
        },
        endAdornment: (
          <InputAdornment position="end">
            {searchText ? (
              <CloseIcon onClick={() => setSearchText("")} />
            ) : (
              <SearchIcon />
            )}
          </InputAdornment>
        ),
      }}
      onChange={e => setSearchText(e.target.value)}
      {...props}
    />
  )
}

SearchInput.propTypes = {}
SearchInput.defaultProps = {
  classes: {},
}

export default SearchInput
