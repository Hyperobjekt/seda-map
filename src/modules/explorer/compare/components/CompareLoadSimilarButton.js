import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'
import axios from 'axios'
import useAddCompareLocations from '../hooks/useAddCompareLocations'
import { getRegionFromLocationId } from '../../app/selectors'
import { useActiveLocation } from '../../location'

const endpoint = process.env.REACT_APP_DATA_ENDPOINT + 'similar/'

const fetchSimilarLocations = locationId => {
  const region = getRegionFromLocationId(locationId)
  const filename = locationId.substring(0, 2) + '.csv'
  return axios(`${endpoint}${region}/${filename}`).then(
    result => {
      // regex to grab the line that matches the feature ID
      const matcher = new RegExp(`^${locationId},.*\n`, 'gm')
      const otherIds = result.data
        .match(matcher)[0]
        .slice(0, -1)
        .split(',')
        .filter(id => id !== locationId)
      return otherIds
    }
  )
}

const CompareLoadSimilarButton = ({ ...props }) => {
  const [state, setState] = useState({
    loading: false,
    loaded: false
  })

  const [locationId] = useActiveLocation()
  const addCompareLocations = useAddCompareLocations()

  const handleLoadSimilar = () => {
    console.log('load similar', locationId)
    setState({ loading: true, loaded: false })
    fetchSimilarLocations(locationId).then(ids => {
      addCompareLocations(ids)
      setState({ loading: false, loaded: true })
    })
  }

  return locationId ? (
    <Button
      disabled={state.loaded}
      onClick={handleLoadSimilar}
      {...props}>
      {state.loading
        ? getLang('LABEL_LOADING')
        : getLang('LABEL_LOAD_SIMILAR')}
    </Button>
  ) : null
}

CompareLoadSimilarButton.propTypes = {}

export default CompareLoadSimilarButton
