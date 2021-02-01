import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from 'react'
import PropTypes from 'prop-types'
import { Highlight } from 'react-instantsearch-dom'
import AutoSuggest from 'react-autosuggest'
import { SearchInput } from '../../../shared'
import { Popper } from '@material-ui/core'
import { SHOW_PUERTO_RICO } from '../../explorer/app/selectors'

// calculate the position for the popper
var calculatePosition = function(data) {
  const x = data.offsets.reference.left
  const y =
    data.offsets.reference.top + data.offsets.reference.height
  data.styles = {
    position: 'fixed',
    top: 0,
    left: 0,
    'z-index': 9999,
    transform: `translate3d(${x}px, ${y}px, 0)`,
    width: data.offsets.reference.width,
    'max-width': `${window.innerWidth - x}px`,
    'max-height': `${window.innerHeight - y}px`
  }
  return data
}

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

const getSectionSuggestions = section => {
  return SHOW_PUERTO_RICO
    ? section.hits
    : section.hits.filter(
        hit =>
          hit.id?.substr(0, 2) !== '72' &&
          hit.state_name !== 'Puerto Rico'
      )
}

/**
 * Autocomplete field used for search
 */
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
  clearOnSelected = true,
  ...props
}) => {
  const [value, setValue] = useState(currentRefinement)
  const [anchorEl, setAnchorEl] = useState(null)

  const inputRef = useRef(null)
  const popperRef = useRef(null)

  const handleChange = event => {
    setValue(event.target.value)
  }

  const handleClear = event => {
    setValue('')
    onClear && onClear(event)
  }

  const handleSelected = (event, hit) => {
    onSelected && onSelected(event, hit)
    if (clearOnSelected) return setValue('')
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

  useLayoutEffect(() => {
    setAnchorEl(inputRef?.current?.input)
  }, [])

  return (
    <AutoSuggest
      ref={inputRef}
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
      renderSuggestionsContainer={options => {
        return (
          <Popper
            popperRef={popperRef}
            anchorEl={anchorEl}
            open={Boolean(options.children)}
            popperOptions={{
              modifiers: {
                computeStyle: {
                  enabled: true,
                  fn: calculatePosition
                }
              }
            }}
            {...options.containerProps}>
            <div>{options.children}</div>
          </Popper>
        )
      }}
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
