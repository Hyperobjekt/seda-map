import React from 'react'
import PropTypes from 'prop-types'
import useCompareDialog from '../hooks/useCompareDialog'
import { Button } from '@material-ui/core';
import { getLang } from '../../app/selectors/lang';

/**
 * Button that opens the compare locations dialog
 */
const CompareButton = props => {
  const [, setDialogOpen] = useCompareDialog();

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }
  return (
    <Button onClick={handleOpenDialog} {...props}>
      { getLang('LOCATION_COMPARE_BUTTON') }
    </Button>    
  )
}

export default CompareButton
