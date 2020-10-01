import React from 'react'
import { Page } from '../../../../shared'
import { SedaHeader } from './header'
import { makeStyles } from '@material-ui/core'
import SedaFooter from './footer'
import SedaDataLoader from './SedaDataLoader'
import SedaExplorer from './SedaExplorer'
import { SedaMenu } from '../../menu'
import { SedaError } from '../../errors'

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

const SedaApp = () => {
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

SedaApp.propTypes = {}

export default SedaApp
