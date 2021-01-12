import React, { useEffect, useState } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'
import axios from 'axios'
import useAddCompareLocations from '../hooks/useAddCompareLocations'
import { getRegionFromLocationId } from '../../app/selectors'
import useCompareStore from '../hooks/useCompareStore'
import { useLocationData } from '../../location'

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

  const selectedLocation = useCompareStore(
    state => state.selectedLocation
  )
  const locationData = useLocationData(selectedLocation)
  const addCompareLocations = useAddCompareLocations()

  // reset disabled state if selected location changes
  useEffect(() => {
    setState({
      loading: false,
      loaded: false
    })
  }, [selectedLocation])

  const handleLoadSimilar = () => {
    setState({ loading: true, loaded: false })
    fetchSimilarLocations(locationData.id).then(ids => {
      addCompareLocations(ids)
      setState({ loading: false, loaded: true })
    })
  }

  return locationData ? (
    <Tooltip
      title={getLang('LOAD_SIMILAR_HINT', {
        location: locationData.name
      })}>
      <Button
        variant="outlined"
        disabled={state.loaded}
        onClick={handleLoadSimilar}
        {...props}>
        {state.loading
          ? getLang('LABEL_LOADING')
          : getLang('LOAD_SIMILAR_BUTTON')}
      </Button>
    </Tooltip>
  ) : null
}

CompareLoadSimilarButton.propTypes = {}

export default CompareLoadSimilarButton
