import React from 'react'
import { RegionsIcon } from '../../../../icons'
import { useRegion } from '../../../app/hooks'
import { getPrefixLang } from '../../../app/selectors/lang'
import SedaPanelButton from './SedaPanelButton'

export default function SedaRegionPanelButton(props) {
  const [region] = useRegion()
  return (
    <SedaPanelButton
      selectionId="region"
      secondary={getPrefixLang(region, 'LABEL')}
      icon={<RegionsIcon />}
      {...props}
    />
  )
}
