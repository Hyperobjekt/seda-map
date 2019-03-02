import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Button } from '@material-ui/core';

const MapLocation = ({ 
  name, 
  number, 
  color, 
  onDismissClick, 
  onLocationClick, 
  onReportClick,
  ...rest 
}) => {
  return (
    <MenuItem 
      onClick={onLocationClick} 
      {...rest}
      className="map-location"
    >
        <ListItemIcon>
          <span style={{background: color}} className="number-marker">{number}</span>
        </ListItemIcon>
        <ListItemText 
          inset 
          primary={name}>
        </ListItemText>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          classes={
            {root: 'map-location__report-button'}
          }
          onClick={onReportClick}
        >View Report</Button>
        <IconButton 
          size="small"
          classes={
            {root: 'map-location__close-button'}
          }
          aria-label="Dismiss Location"
          onClick={(e)=> { 
            e.preventDefault();
            e.stopPropagation();
            onDismissClick();
            return false;
          }}
        >
          <CloseIcon />
        </IconButton>
    </MenuItem>
  )
}

MapLocation.propTypes = {
  name: PropTypes.string.isRequired,
  onDismissClick: PropTypes.func.isRequired,
  onLocationClick: PropTypes.func.isRequired,
  number: PropTypes.number,
  color: PropTypes.string,
}

export default MapLocation
