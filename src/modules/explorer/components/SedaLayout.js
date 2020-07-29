import React from 'react'
import { Page, PageBody } from '../../../shared/components/Page'
import { SedaHeader } from './header'
import SedaMenu from './SedaMenu'
import { makeStyles } from '@material-ui/core'
import SedaFooter from './SedaFooter'
import SedaError from './SedaError'
import SedaDataLoader from './SedaDataLoader'
import SedaExplorer from './SedaExplorer'

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  body: {
    overflow: 'hidden'
  },
  error: {
    position: 'absolute',
    bottom: 64,
    right: 24,
    zIndex: 999
  }
}))

const SedaLayout = () => {
  const classes = useStyles()

  return (
    <Page>
      <SedaHeader />
      <div className={classes.offset} />
      <SedaMenu />
      <SedaDataLoader />
      <SedaExplorer className={classes.body} />
      <SedaFooter />
      <SedaError className={classes.error} />
    </Page>
  )
}

SedaLayout.propTypes = {}

export default SedaLayout
