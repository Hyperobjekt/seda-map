import React from 'react'
import { Page } from '../../../../shared'
import { SedaHeader } from './header'
import {
  makeStyles,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import SedaFooter from './footer'
import { SedaDataLoader } from '../../loader'
import SedaExplorer from './SedaExplorer'
import { SedaMenu } from '../../menu'
import { SedaRouting } from '../../routing'
import SedaShortcuts from './SedaShortcuts'
import { useUiStore } from '../hooks'

const useStyles = makeStyles(theme => ({
  offset: {
    ...theme.mixins.toolbar,
    minHeight: 56,
    [theme.breakpoints.down('sm')]: {
      minHeight: 97
    }
  },
  root: {
    overflow: 'hidden'
  },
  embed: {
    '& $offset': {
      minHeight: 56
    }
  },
  body: {
    overflow: 'hidden'
  }
}))

const SedaApp = () => {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isEmbed = useUiStore(state => state.isEmbed)
  return (
    <Page
      className={(classes.root, { [classes.embed]: isEmbed })}>
      <SedaShortcuts />
      <SedaRouting />
      <SedaHeader isMobile={isMobile} />
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
