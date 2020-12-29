import useDataOptions from '../../app/hooks/useDataOptions'
import shallow from 'zustand/shallow'

/**
 * Provides the current error (if any) and a function to set an error for the app
 * @returns [error, setError]
 */
export default () => {
  return useDataOptions(
    state => [state.error, state.setError],
    shallow
  )
}
