import React from 'react'
import PropTypes from 'prop-types'
import Field from './Field'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& *': {
      marginRight: theme.spacing(1),
      flex: 0.5,
      '&:last-child': { marginRight: 0 }
    }
  },
  field: {}
}))

/**
 * UI for displaying and changing active filter rules
 * @param {*} param0
 */
const FilterFields = ({
  fields,
  values,
  onChange,
  classes: overrides,
  className,
  ...props
}) => {
  const classes = useStyles()
  const handleChange = (field, idx, e) => {
    onChange && onChange(field, idx, e)
  }
  return (
    <div
      className={clsx(classes.root, overrides.root, className)}
      {...props}>
      {fields.map((f, i) => {
        return (
          <Field
            key={'field' + i}
            value={values[i]}
            className={clsx(classes.field, overrides.field)}
            {...f}
            onChange={e => handleChange(f, i, e)}
          />
        )
      })}
    </div>
  )
}

FilterFields.defaultProps = {
  classes: {}
}

FilterFields.propTypes = {
  fields: PropTypes.array,
  values: PropTypes.array,
  onChange: PropTypes.func,
  classes: PropTypes.object,
  className: PropTypes.string
}

export default FilterFields
