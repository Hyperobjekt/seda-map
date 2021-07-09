import React from 'react'
import useCompareDialog from '../hooks/useCompareDialog'
import { Button } from '@material-ui/core'
import { getLang } from '../../app/selectors/lang'
import CompareDialog from './CompareDialog'
import { useLocations } from '../../location'
import { CompareIcon } from '../../../icons'

/**
 * Button that opens the compare locations dialog
 */
const CompareButton = props => {
  const [, setDialogOpen] = useCompareDialog()
  const [locations] = useLocations()

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }
  return (
    <>
      <Button
        disabled={locations.length === 0}
        onClick={handleOpenDialog}
        {...props}>
        <CompareIcon />
        {getLang('LOCATION_COMPARE_BUTTON')}
      </Button>
      <CompareDialog />
    </>
  )
}

export default CompareButton
