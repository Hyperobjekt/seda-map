import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Highlight } from 'react-instantsearch-dom'
import AutoSuggest from 'react-autosuggest'
import SearchInput from '../../../shared/components/SearchInput'

/** Renders the input component for search */
const renderInputComponent = (
  inputProps,
  SearchInputProps = {}
) => (
  <SearchInput inputProps={inputProps} {...SearchInputProps} />
)

const renderSuggestion = hit => {
  return (
    <div>
      <Highlight attribute="name" hit={hit} tagName="mark" />
      {hit && hit.city && ', '}
      {hit && hit.city && (
        <Highlight attribute="city" hit={hit} tagName="mark" />
      )}
      {hit && hit.state_name && ', '}
      <Highlight
        attribute="state_name"
        hit={hit}
        tagName="mark"
      />
    </div>
  )
}

const renderSectionTitle = section => section.index

const getSuggestionValue = hit => hit.name

const getSectionSuggestions = section => section.hits

const AutoComplete = ({
  hits,
  currentRefinement,
  refine,
  multiSection,
  TextFieldProps,
  inputProps,
  hideSuggestions = false,
  onSuggestionSelected: onSelected,
  onSelectedClear: onClear,
  value: overrideValue,
  ...props
}) => {
  const [value, setValue] = useState(currentRefinement)

  const handleChange = event => {
    setValue(event.target.value)
  }

  const handleClear = event => {
    setValue('')
    onClear && onClear(event)
  }

  const handleSelected = (event, hit) => {
    onSelected && onSelected(event, hit)
    const value = [hit.suggestion.name]
    if (hit.suggestion.state_name)
      value.push(hit.suggestion.state_name)
    setValue(value.join(', '))
  }

  const handleFetchRequested = ({ value }) => {
    refine(value)
  }

  const handleClearRequested = () => {
    refine()
  }

  const combinedInputProps = {
    ...inputProps,
    value,
    onChange: handleChange
  }

  // if a new value is provided, override the existing value
  useEffect(() => {
    if (overrideValue || overrideValue === '')
      setValue(overrideValue)
  }, [overrideValue])

  return (
    <AutoSuggest
      suggestions={hideSuggestions ? [] : hits}
      multiSection={multiSection}
      inputProps={combinedInputProps}
      getSuggestionValue={getSuggestionValue}
      getSectionSuggestions={getSectionSuggestions}
      onSuggestionsFetchRequested={handleFetchRequested}
      onSuggestionsClearRequested={handleClearRequested}
      onSuggestionSelected={handleSelected}
      renderInputComponent={inputProps =>
        renderInputComponent(inputProps, {
          onClear: handleClear,
          value,
          TextFieldProps
        })
      }
      renderSectionTitle={renderSectionTitle}
      renderSuggestion={renderSuggestion}
      {...props}
    />
  )
}

AutoComplete.defaultProps = {
  inputProps: {}
}

AutoComplete.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
  onSelectedClear: PropTypes.func.isRequired
}

export default AutoComplete
