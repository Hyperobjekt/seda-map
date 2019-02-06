import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

const Header = ({ onActionClick, children }) => (
  <AppBar className="header-wrapper" position="sticky">
    <Toolbar className="header-container">
      <Grid container 
            alignItems="center" 
            justify="space-between" 
            spacing={24} 
            className="header-content">
          <Grid item>
            {children}
          </Grid>
          <Grid item>
            <IconButton 
              onClick={() => onActionClick('menu')}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  onActionClick: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onActionClick: (action) => dispatch({type: 'MENU_ITEM_CLICK', item: action})
})

export default connect(
  null, 
  mapDispatchToProps
)(Header)