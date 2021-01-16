import React from 'react'
import SedaLogo from './SedaLogo'
import {
  makeStyles,
} from '@material-ui/core'

import {
  PageHeader
} from '../../../../../shared'

import SedaHeaderTitle from './SedaHeaderTitle'
import SedaHeaderDataButton from './SedaHeaderDataButton'
import SedaHeaderActions from './SedaHeaderActions'

const useLogoStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    width: theme.spacing(4),
    height: theme.spacing(4),
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    }
  },
  logo: {
    width: 'auto',
    height: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(3),
    }
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


const useHeaderStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  logo: {
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(1),
    }
  },
  
  subheading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(11),
    }
  },
  toolbar: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    // add padding to make space for menu button
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(7),
      minHeight: theme.spacing(7)
    }
  },
  actionsMobile: {
    minWidth: '100%',
    borderTop: '1px solid #E5E5E5',
  }
}))

const SedaHeader = ({isMobile, ...props}) => {
  const classes = useHeaderStyles()
  return (
    <PageHeader
      classes={classes}
      isMobile={isMobile}
      LogoComponent={!isMobile ? <HeaderLogo /> : <SedaHeaderDataButton />}
      ActionsComponent={<SedaHeaderActions />}
      {...props}>
        <SedaHeaderTitle />
    </PageHeader>
  )
}

export default SedaHeader
