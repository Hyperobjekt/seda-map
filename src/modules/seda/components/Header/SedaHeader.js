import React from 'react'
import PropTypes from 'prop-types'
import { PageHeader } from '../../../../base/components/Page'
import SedaLogo from './SedaLogo'
import { makeStyles, Typography } from '@material-ui/core'
import SedaHelpButton from './SedaHelpButton'
import SedaMenuButton from './SedaMenuButton'
import SedaViewControls from './SedaViewControls'
import SearchInput from '../../../../base/components/SearchInput'

const useLogoStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    width: theme.spacing(4),
    height: theme.spacing(4),
    overflow: 'hidden'
  },
  logo: {
    width: 'auto',
    height: theme.spacing(4)
  }
}))

const HeaderLogo = props => {
  const classes = useLogoStyles()
  return (
    <a className={classes.root} href="/">
      <SedaLogo className={classes.logo} />
    </a>
  )
}

const useActionStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  searchRoot: {
    width: 180,
    marginRight: theme.spacing(2)
  },
  viewControls: {
    marginRight: theme.spacing(2)
  },
  helpButton: {
    marginRight: theme.spacing(2)
  }
}))

const HeaderActions = ({ ...props }) => {
  const classes = useActionStyles()
  return (
    <div className={classes.root} {...props}>
      <SearchInput
        classes={{ root: classes.searchRoot }}
        condensed
        placeholder="find a place"
      />
      <SedaViewControls className={classes.viewControls} />
      <SedaHelpButton classes={{ root: classes.helpButton }} />
      <SedaMenuButton />
    </div>
  )
}

const useHeaderStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  logo: {
    marginRight: theme.spacing(2)
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    textTransform: 'capitalize'
  },
  subheading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary
  }
}))

const SedaHeader = ({ heading, subheading, onMenuClick }) => {
  const classes = useHeaderStyles()
  return (
    <PageHeader
      classes={classes}
      LogoComponent={<HeaderLogo />}
      ActionsComponent={<HeaderActions />}>
      <Typography className={classes.heading} variant="h1">
        {heading}
      </Typography>
      <Typography className={classes.subheading} variant="body2">
        {subheading}
      </Typography>
    </PageHeader>
  )
}

SedaHeader.propTypes = {}

export default SedaHeader
