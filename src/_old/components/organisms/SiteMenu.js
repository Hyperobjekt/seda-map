import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import CloseButton from '../molecules/CloseButton';

const SiteMenu = ({
  open = false,
  navItems = [],
  activeItemId,
  socialItems = [],
  onClose,
}) => {
  return (
    <div className={classNames("site-menu", { 'site-menu--open': open })}>
      { open && 
        <div className="site-menu__content">
          <nav>
            <ul className={classNames("site-menu__links")}>
              { Boolean(navItems.length) && navItems.map((item, i) =>
                <li 
                  key={"nav-" + i}
                  className={
                    classNames(
                      "site-menu__link", 
                      { 'site-menu__link--active': activeItemId === item.id }
                    )
                  } 
                >
                  <a href={item.url}>{item.label}</a>
                </li>
              ) }
            </ul>
          </nav>
          <div className="site-menu__social-links">
            <ul>
              { Boolean(socialItems.length) && socialItems.map((item, i) =>
                <li key={"nav-" + i}>
                  <a href={item.url}>{item.icon}</a>
                </li>
              ) }
            </ul>
          </div>
          <CloseButton className="site-menu__close" onClick={onClose}>
            <span className="button-label">Close</span>
          </CloseButton>
        </div>
      }
    </div>
  )
}

SiteMenu.propTypes = {
  open: PropTypes.bool,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  activeItemId: PropTypes.string,
  socialItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      icon: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  onClose: PropTypes.func,
}

export default SiteMenu
