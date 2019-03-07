import { fetchVarsFromCSV } from "../utils";

/**
 * Fetches the data for the variables and dispatches events
 * @param {Array<String>} vars array of variable names to fetch
 * @param {string} region region to fetch for (counties, districts, schools)
 */
export const loadVarsForRegion = (vars = [], region) => 
  (dispatch) => {
    dispatch({ type: 'FETCH_VAR_REQUEST' })
    fetchVarsFromCSV(vars, region)
      .then(data => {
        dispatch({
          type: 'FETCH_VAR_SUCCESS',
          region,
          data
        })
      })
      .catch(err => dispatch({
        type: 'FETCH_VAR_ERROR',
        errorMessage: err.message ? err.message : err
      }))
  }
