import axios from 'axios'
import { parseLocationsString } from './selectors/router'

const FLAGGED_ENDPOINT =
  process.env.REACT_APP_DATA_ENDPOINT + 'flagged/'

export const loadFlaggedData = type => {
  return axios.get(FLAGGED_ENDPOINT + type + '.json')
}
