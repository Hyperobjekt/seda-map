import React from 'react'
import { Page } from '../../../../shared'
import { SedaHeader } from './header'
import { makeStyles } from '@material-ui/core'
import SedaFooter from './footer'
import { SedaDataLoader } from '../../loader'
import SedaExplorer from './SedaExplorer'
import { SedaMenu } from '../../menu'
import { SedaRouting } from '../../routing'
import SedaShortcuts from './SedaShortcuts'

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar,
  root: {
    overflow: 'hidden'
  },
  body: {
    overflow: 'hidden'
  }
}))

const SedaApp = () => {
  const classes = useStyles()

  return (
    <Page className={classes.root}>
      <SedaShortcuts />
      <SedaRouting />
      <SedaHeader />
      <div className={classes.offset} />
      <SedaMenu />
      <SedaDataLoader />
      <SedaExplorer className={classes.body} />
      <SedaFooter />
    </Page>
  )
}

SedaApp.propTypes = {}

export default SedaApp
