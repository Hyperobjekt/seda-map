import React from 'react'
import MapLegend from '../map/components/MapLegend'

function ComponentLibrary() {
  return (
    <MapLegend
      primary="Average Test Scores for all students"
      secondary="in grade levels, relative to U.S. average"
      labelRange={[-4.5, 4.5]}
      colorRange={[-3, 3]}
      colors={[
        '#174b80',
        '#4189d2',
        '#abd9e9',
        '#f7f7f7',
        '#bfe9ab',
        '#2fb57f',
        '#136e4a'
      ]}
      midLabel="national average"
      markerPosition={0.666}
    />
  )
}

export default ComponentLibrary
