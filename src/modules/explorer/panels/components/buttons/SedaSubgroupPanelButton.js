import React from 'react'
import { SubgroupsIcon } from '../../../../icons'
import { useDemographic } from '../../../app/hooks'
import { getPrefixLang } from '../../../app/selectors/lang'
import SedaPanelButton from './SedaPanelButton'

export default function SedaSubgroupPanelButton(props) {
  const [demographic] = useDemographic()
  return (
    <SedaPanelButton
      panelId="demographic"
      secondary={getPrefixLang(demographic, 'LABEL')}
      icon={<SubgroupsIcon />}
      {...props}
    />
  )
}
