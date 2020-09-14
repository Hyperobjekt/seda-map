
import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SedaHeader from './SedaHeader';
import SedaFooter from './SedaFooter';

const SedaPage = ({children, classes = {}}) => {
  return (
    <div className={classNames("page", classes.root)}>
      <SedaHeader />
      <main id="main" className={classNames("page__body", classes.main)}>
        {children}
      </main>
      <SedaFooter />
    </div>
  )
}

SedaPage.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
}

export default SedaPage