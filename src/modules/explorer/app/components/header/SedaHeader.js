import React from 'react'
import SedaLogo from './SedaLogo'
import {
  makeStyles,
} from '@material-ui/core'
import SedaViewControls from './SedaViewControls'

import {
  PageHeader
} from '../../../../../shared'
import { useActiveView } from '../../hooks'
import { SedaHelpButton } from '../../../help'
import { SedaMenuButton } from '../../../menu'
import { SedaSearch } from '../../../search'
import { useCondensedPanel } from '../../../panels'
import SedaHeaderTitle from './SedaHeaderTitle'

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

const SettingsIcon = props => (
  <svg {...props} width="19" height="20" viewBox="0 0 19 20" fill="none">
    <line x1="16.425" y1="1.85773e-08" x2="16.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
    <line x1="9.425" y1="1.85773e-08" x2="9.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
    <line x1="2.425" y1="1.85773e-08" x2="2.425" y2="20" stroke="#031232" strokeWidth="0.85"/>
    <circle cx="16.5" cy="6.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
    <circle cx="9.5" cy="14.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
    <circle cx="2.5" cy="5.5" r="2.075" fill="white" stroke="#031232" strokeWidth="0.85"/>
  </svg>
)

const HeaderOptionsToggle = () => {
  const classes = useLogoStyles()
  const [, toggleCondensed] = useCondensedPanel()

  return (
    <div className={classes.root} onClick={() => toggleCondensed()}>
      <SettingsIcon className={classes.logo} />
    </div>
  )
}

const useActionStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems:  'center',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      flexDirection: 'row-reverse',
      borderTop: '1px solid #E5E5E5',
    }
  },
  searchRoot: {
    width: 180,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      marginRight: 0,
    },
    '& fieldset': {
      [theme.breakpoints.down('sm')]: {
        border: 0,
      },
    }
  },
  viewControls: {
    marginRight: theme.spacing(2)
  },
  helpButton: {
    marginRight: theme.spacing(2)
  }
}))

const HeaderActions = ({ isMobile, ...props }) => {
  const classes = useActionStyles()
  const [, , isEmbed] = useActiveView()
  return (!isEmbed &&
    <div className={classes.root} {...props}>
      <SedaSearch
        TextFieldProps={{
          classes: { root: classes.searchRoot }
        }}
        placeholder="find a place"
      />
      <SedaViewControls className={classes.viewControls} />
      {
        !isMobile && (
          <SedaHelpButton classes={{ root: classes.helpButton }} />
        )
      }
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
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2),
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
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(6),
    }
  }
}))

const SedaHeader = ({isMobile, ...props}) => {
  const classes = useHeaderStyles()
  return (
    <PageHeader
      classes={classes}
      isMobile={isMobile}
      LogoComponent={!isMobile ? <HeaderLogo /> : <HeaderOptionsToggle />}
      ActionsComponent={<HeaderActions isMobile={isMobile} />}
      {...props}>
        <SedaHeaderTitle />
    </PageHeader>
  )
}

export default SedaHeader
