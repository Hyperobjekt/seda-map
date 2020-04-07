import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MENU } from '../../shared/constants/site'
import SiteMenu from '../organisms/SiteMenu'

const SedaMenu = ({ menuOpen, onClose }) => {
  return (
    <SiteMenu
      open={menuOpen}
      navItems={MENU.navItems}
      socialItems={MENU.socialItems}
      activeItemId="explorer"
      onClose={onClose}
    />
  )
}

SedaMenu.propTypes = {
  menuOpen: PropTypes.bool,
  onClose: PropTypes.func
}

const mapStateToProps = ({ ui: { menuOpen } }) => ({
  menuOpen
})

const mapDispatchToProps = dispatch => ({
  onClose: () =>
    dispatch({
      type: 'TOGGLE_MENU',
      open: false
    })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SedaMenu)
